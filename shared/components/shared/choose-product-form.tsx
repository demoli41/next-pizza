import { cn } from "@/shared/lib/utils";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  loading?: boolean;
  onSubmit?: VoidFunction;
  className?: string;
}

export const ChooseProductForm: React.FC<Props> = ({
  name,
  imageUrl,
  price,
  onSubmit,
  className,
  loading,
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row w-full", className)}>
      {/* Image */}
      <div className="flex justify-center items-center flex-1 p-6 bg-white">
        <img
          src={imageUrl}
          alt={name}
          className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] object-contain"
        />
      </div>

      {/* Info */}
      <div className="w-full md:w-[490px] bg-[#f7f6f5] p-6 md:p-7">
        <Title text={name} size="md" className="font-extrabold mb-4" />

        <Button
          loading={loading}
          onClick={() => onSubmit?.()}
          className="h-[50px] md:h-[55px] px-8 text-base rounded-[16px] w-full mt-6">
          Додати в корзину за {price} ₴
        </Button>
      </div>
    </div>
  );
};
