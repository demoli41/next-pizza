import React from "react";
import { WhiteBlock } from "./white-block";
import { CheckoutItemDetails } from "./checkout-item-details";
import { ArrowRight, Package, ShoppingBasket, Truck } from "lucide-react";
import { Button, Skeleton } from "../ui";
import { cn } from "@/shared/lib/utils";

const VAT = 5;
const DELIVERY_PRICE = 100;



interface Props {
    totalAmount: number; 
    loading?: boolean;
    className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({totalAmount,loading, className}) => {


    const vatPrice = (totalAmount * VAT)/100;
    const totalPrice = totalAmount + vatPrice + DELIVERY_PRICE;

    return(
        <WhiteBlock className={cn("p-6 sticky top-4",className)}>
                            <div className="flex flex-col gap-1">
                                <span className="text-xl font-extrabold">Всього</span>
                                {
                                    loading?
                                    <Skeleton className="w-48 h-11" />
                                    :
                                    <span className="h-11 text-[34px] font-extrabold">{totalPrice} ₴</span>
                                }
                            </div>

                            <CheckoutItemDetails title={
                                <div className="flex items-center">
                                <ShoppingBasket size={18} className="mr-2 text-gray-400"/>
                                Вартість кошика:
                                </div>
                            } value={loading ? <Skeleton className="w-16 h-6" /> : `${totalAmount} ₴`} />
                            <CheckoutItemDetails title={
                                <div className="flex items-center">
                                <Package size={18} className="mr-2 text-gray-400"/>
                                Пакування:
                                </div>
                            } value={loading ? <Skeleton className="w-16 h-6" /> : `${vatPrice} ₴`} />
                             <CheckoutItemDetails title={
                                <div className="flex items-center">
                                <Truck size={18} className="mr-2 text-gray-400"/>
                                Доставка:
                                </div>
                            } value={loading ? <Skeleton className="w-16 h-6" /> : `${DELIVERY_PRICE} ₴`} />

                        <Button
                        loading={loading}
                            type="submit"
                            className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
                            Перейти до оплати
                            <ArrowRight className="w-5 ml-2" />
                        </Button>
                        </WhiteBlock>
    )
}