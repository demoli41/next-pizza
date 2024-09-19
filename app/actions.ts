"use server";

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate } from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { sendEmail } from "@/shared/lib";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";


export async function createOrder(data:CheckoutFormValues) {
   try{

    const cookieStore=cookies();
    const cartToken=cookieStore.get('cartToken')?.value;

    if(!cartToken){
        throw new Error('Cart token not found');
    }

    // Find cart by token
    const userCart=await prisma.cart.findFirst({
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

    // If cart not found

    if (!userCart) {
        throw new Error('Cart not found');
      }
  
      if (userCart?.totalAmount === 0) {
        throw new Error('Cart is empty');
      }

      // Create order
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

      // Clear cart
      await prisma.cart.update({
        where: {
          id: userCart.id,
        },
        data: {
          totalAmount: 0,
        },
      });

      // Clear cart items
      await prisma.cartItem.deleteMany({
        where: {
          cartId: userCart.id,
        },
      });

      // Return order url

      await sendEmail(data.email, 'Pizza house | Оплатіть замовлення №'+ order.id, PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl: "template",
      }),
    );

   }catch(err){
    console.log('[CreateOrder] Server error',err);

   }
}