import {z} from 'zod';

export const checkoutFormSchema=z.object({
    firstName:z.string().min(2, {message:'Ім`я повинно містити мінімум 2 символи'}),
    lastName:z.string().min(2, {message:'Прізвище повинно містити мінімум 2 символи'}),
    email:z.string().email({message:'Некоректний email'}),
    phone:z.string().min(10, {message:'Телефон повинен містити мінімум 10 символів'}),
    address:z.string().min(5, {message:'Введіть коректний адрес'}),
    comment:z.string().optional(),
});

export type CheckoutFormValues=z.infer<typeof checkoutFormSchema>;