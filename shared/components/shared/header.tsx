'use client';

import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import { SearchInput } from "./search-input";
import React from "react";
import Image from "next/image";
import { Button } from "../ui";
import {  UserRound } from "lucide-react";
import Link from "next/link";
import { CartButton } from "./cart-button";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";


interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({hasSearch=true,hasCart=true,className}) => {

const searchParams = useSearchParams();
const router = useRouter();

React.useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const cancelled = searchParams.get('cancelled');

    if (sessionId) {
        setTimeout(() => {
            toast.success('Дякуємо! Ваше замовлення успішно оплачене!');
        }, 1000);
    }

    if (cancelled) {
        setTimeout(() => {
            toast.error('Оплату було скасовано. Ви можете спробувати ще раз.');
        }, 1000);
    }

    if (sessionId || cancelled) {
        const newParams = new URLSearchParams(window.location.search);
        newParams.delete('session_id');
        newParams.delete('cancelled');

        const newUrl =
            window.location.pathname + (newParams.toString() ? '?' + newParams.toString() : '');
        window.history.replaceState({}, '', newUrl);
    }
}, [searchParams]);

return (
    <header className={cn(' border-b',className)}>
        <Container className="flex items-center justify-between py-8 ">
            {/* left part */}
           <Link href="/">
           <div className="flex items-center gap-4">
                <Image src="/logo.png" alt="Logo" width={35} height={35} />
                <div>
                    <h1 className="text-2xl uppercase font-black">Pizza House Volochysk</h1>
                    <p className="text-sm text-gray-400 leading-3">З нами завжди смачніше!</p>
                </div>
            </div>
           </Link>

           {hasSearch && <div className="mx-10 flex-1">
                <SearchInput/>
            </div>}

               {/* right part */}
               <div className='flex items-start gap-1'>
                    <Button variant='outline' className="flex items-center gap-3">
                    <UserRound size={16}/>
                        Увійти</Button>
                       {hasCart && <CartButton/>}
               </div>
        </Container>
    </header>
);
};