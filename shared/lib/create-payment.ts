
import Stripe from 'stripe';

interface Props {
  description: string;
  orderId: number;
  amount: number; 
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', 
});

/**
 * Створює сесію Stripe Checkout для оплати.
 * @param details - Деталі платежу: опис, ID замовлення та сума.
 * @returns Об'єкт з URL для перенаправлення та ID сесії.
 */
export async function createStripeCheckoutSession(details: Props) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'uah',
            product_data: {
              name: details.description,
            },
            unit_amount: Math.round(details.amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id: details.orderId.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?cancelled`,
    });
    return {
      url: session.url,
      id: session.id,
    };
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    throw new Error('Failed to create Stripe checkout session.');
  }
}
