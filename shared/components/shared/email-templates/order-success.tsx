import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import React from 'react';

interface Props {
  orderId: number;
  items:CartItemDTO[];
}

export const OrderSuccessTemplate: React.FC<Props> = ({
    orderId,items
}) => (
  <div>
    <h1>Дякуємо за замовлення!</h1>

    <p>Ваше замовлення #${orderId} оплочено. Список товарів</p>

    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.productItem.product.name} - {item.quantity} шт. по{' '}
          {item.productItem.price} грн.
        </li>
      ))}
    </ul>
  </div>
);