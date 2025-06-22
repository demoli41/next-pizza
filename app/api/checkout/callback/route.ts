import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/prisma/prisma-client';
import { OrderStatus } from '@prisma/client';
import { sendEmail } from '@/shared/lib';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { OrderSuccessTemplate } from '@/shared/components/shared/email-templates/order-success';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Секретний ключ для перевірки підпису вебхука.
// Його потрібно взяти з налаштувань вебхука в Stripe Dashboard.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // Перевірка, що запит дійсно надійшов від Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Обробка події checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Перевіряємо, чи є metadata і order_id
    if (!session?.metadata?.order_id) {
        console.error('❌ Metadata or order_id missing in session');
        return NextResponse.json({ error: 'Metadata or order_id missing' }, { status: 400 });
    }

    const orderId = Number(session.metadata.order_id);

    try {
      // Знаходимо замовлення в базі даних
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        console.error(`❌ Order with ID ${orderId} not found.`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Перевіряємо, чи оплата дійсно успішна і чи замовлення ще не оброблене
      if (session.payment_status === 'paid' && order.status === OrderStatus.PENDING) {
        // Оновлюємо статус замовлення на SUCCEEDED
        await prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.SUCCEEDED },
        });

        // Надсилаємо лист про успішну оплату
        const items = JSON.parse(order.items as string) as CartItemDTO[];
        await sendEmail(
          order.email,
          'Pizza House | Ваше замовлення успішно оплачене',
          OrderSuccessTemplate({
            orderId: order.id,
            items: items, // Переконайтеся, що ваш шаблон приймає ці дані
          })
        );
         console.log(`✅ Order ${orderId} successfully processed.`);
      }

    } catch (err) {
      console.error('Error processing order:', err);
      return NextResponse.json({ error: 'Server error while processing order' }, { status: 500 });
    }
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  // Повертаємо відповідь 200, щоб Stripe знав, що ми отримали подію
  return NextResponse.json({ received: true });
}
