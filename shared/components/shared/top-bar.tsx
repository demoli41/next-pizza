import React from "react";
import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import { Categories } from "@/shared/components/shared/categories";
import { SortPopup } from "@/shared/components/shared/sort-popup";
import { Category } from "@prisma/client";


interface Props {
    categories: Category[];
    className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
    return (
        <div className={cn('sticky top-0 bg-white pb-5 shadow-lg shadow-black/5 z-10', className)}>
            <Container className="flex items-center justify-between">
                <div className="overflow-x-auto max-w-full scrollbar-hide">
                    <Categories
                        className="flex-nowrap min-w-max"
                        items={categories}
                    />
                </div>
                <SortPopup className="hidden md:flex flex-shrink-0" />
            </Container>
        </div>
    );
};