'use client';

import { Dialog } from "@/shared/components/ui";
import { DialogContent } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import React from "react";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/@types/prisma";
import { ProductForm } from "../product-form";

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          "p-0 w-full max-w-[95vw] md:max-w-[1060px] h-[90vh] overflow-y-auto rounded-xl bg-white",
          className
        )}
      >
        <ProductForm product={product} onSubmit={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
};
