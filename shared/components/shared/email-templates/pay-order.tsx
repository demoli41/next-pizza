import React from 'react';

interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
}

export const PayOrderTemplate: React.FC<Props> = ({
    orderId,totalAmount,paymentUrl
}) => (
  <div>
    <h1>Заказ #{orderId}</h1>

    <p>Оплатіть замовлення на суму <b>{totalAmount} ₴</b>.Перейдіть <a href={paymentUrl}>по цьому посиланню</a> для оплати замовлення</p>
  </div>
);