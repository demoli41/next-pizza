"use server";

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate, VerificationUserTemplate } from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { createStripeCheckoutSession } from "@/shared/lib";
import { sendEmail } from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }

    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    if (!userCart) {
      throw new Error('Cart not found');
    }

    if (userCart.totalAmount === 0) {
      throw new Error('Cart is empty');
    }

    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + ' ' + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
      },
    });

    await prisma.cart.update({
      where: { id: userCart.id },
      data: { totalAmount: 0 },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: userCart.id },
    });

    const paymentSession = await createStripeCheckoutSession({
      amount: order.totalAmount,
      orderId: order.id,
      description: 'Оплата замовлення №' + order.id,
    });


    if (!paymentSession || !paymentSession.url || !paymentSession.id) {
      throw new Error('Payment session creation failed');
    }


    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: paymentSession.id,
      },
    });


    const paymentUrl = paymentSession.url;

    await sendEmail(
      data.email,
      'Pizza house | Оплатіть замовлення №' + order.id,
      PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl,
      })
    );

    return paymentUrl;
  } catch (err) {
    console.error('[CreateOrder] Server error', err);
    throw err;
  }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const findUser = await prisma.user.findFirst({
      where: { id: Number(currentUser.id) },
    });

    await prisma.user.update({
      where: { id: Number(currentUser.id) },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
      },
    });

  } catch (err) {
    console.error('[UpdateUserInfo] Server error', err);
    throw err;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: { email: body.email },
    });

    if (user) {
      if (!user.verified) {
        throw new Error('Пошта не підтверджена');
      }
      throw new Error('Користувач з таким E-Mail вже існує');
    }

    const createUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code= Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createUser.id,
      },
    });

        await sendEmail(
      createUser.email,
      'Pizza house | Підтвердити реєстрацію',
      VerificationUserTemplate({
        code,
      })
    );


    
  } catch (err) {
    console.error('[RegisterUser] Server error', err);
    throw err;
  }
}
