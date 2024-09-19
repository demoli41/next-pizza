'use client';

import { FormProvider, set, useForm } from "react-hook-form";
import { CheckoutSidebar, Container, Title } from "@/shared/components/shared";
import { useCart } from "@/shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutAddressForm, CheckoutCart, CheckoutPersonalForm } from "@/shared/components";
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import { useState } from "react";



export default function CheckoutPage() {
    const [submitting, setSubmitting] = useState(false);
    const {totalAmount,updateItemQuantity,items,removeCartItem,loading}=useCart();

   const form=useForm<CheckoutFormValues>({
    resolver:zodResolver(checkoutFormSchema),
    defaultValues:{
        email:'',
        firstName:'',
        lastName:'',
        phone:'',
        address:'',
        comment:'',
    }
   });

   const onSubmit=async (data:CheckoutFormValues)=>{
    try{
        setSubmitting(true);
        const url=await createOrder(data);

        toast.success('Замовлення успішно оформлено! Перехід до оплати...',{
            icon:'🚀'
        });

        if(url){
            location.href=url;
        }

    }catch(err){
        console.log(err);
        setSubmitting(false);
        toast.error('Помилка при оформленні замовлення',{
            icon:'❌'
        });
    }
   }

    const onClickCountButton=(id:number,quantity:number,type:'plus'|'minus')=>{
        const newQuantity=type==='plus'?quantity+1:quantity-1;
        updateItemQuantity(id,newQuantity);
      }


    return (/* TO DO react imask for tel number  */
    <Container>
        <Title text="Оформлення замовлення"  className="font-extrabold mb-8 text-[36px]"/>
            <FormProvider {...form}>              
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-10">
                {/* Left side */}
                <div className="flex flex-col gap-10 flex-1 mb-20">
                    <CheckoutCart 
                    onClickCountButton={onClickCountButton} 
                    removeCartItem={removeCartItem}
                    items={items}
                    loading={loading}
                    />
                    <CheckoutPersonalForm className={loading ? "opacity-40 pointer-events-none" : ''}/>
                    <CheckoutAddressForm className={loading ? "opacity-40 pointer-events-none" : ''}/>
                
                </div>

                {/* Right side */}
                <div className="w-[450px]">
                        <CheckoutSidebar  totalAmount={totalAmount} loading={loading || submitting}/>
                </div>
            </div>
            </form>
            </FormProvider>
    </Container>
);
} 