import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import { SearchInput } from "./search-input";
import React from "react";
import Image from "next/image";
import { Button } from "../ui";
import {  UserRound } from "lucide-react";
import Link from "next/link";
import { CartButton } from "./cart-button";

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({hasSearch=true,hasCart=true,className}) => {
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