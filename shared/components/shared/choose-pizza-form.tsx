import { cn } from "@/shared/lib/utils";
import React from "react";
import { PizzaImage } from "./pizza-image";
import { Title } from "./title";
import { Button } from "../ui";
import { GroupVariants } from "./group-variants";
import { PizzaSize, PizzaType, pizzaTypes } from "@/shared/constants/pizza";
import { Ingredient, ProductItem } from "@prisma/client";
import { IngredientItem } from "./ingredient-item";
import { getPizzaDetails } from "@/shared/lib";
import { usePizzaOptions } from "@/shared/hooks";

interface Props {
    imageUrl: string;
    name: string;
    ingredients: Ingredient[];
    items: ProductItem[];
    loading?: boolean;
    onSubmit: (itemId: number, ingredients: number[]) => void;
    className?: string;
}

export const ChoosePizzaForm: React.FC<Props> = ({
    name,
    items,
    imageUrl,
    ingredients,
    loading,
    onSubmit,
    className,
}) => {
    const {
        size,
        type,
        selectedIngredients,
        availableSizes,
        currentItemId,
        setSize,
        setType,
        addIngredient,
    } = usePizzaOptions(items);

    const { totalPrice, textDetaills } = getPizzaDetails(
        type,
        size,
        items,
        ingredients,
        selectedIngredients
    );

    const handleClickAddCart = () => {
        if (currentItemId) {
            onSubmit(currentItemId, Array.from(selectedIngredients));
        }
    };

    return (
        <div className={cn("flex flex-col md:flex-row w-full min-h-full", className)}>
            {/* Pizza Image */}
            <div className="flex justify-center items-center flex-1 bg-white p-6">
                <PizzaImage imageUrl={imageUrl} size={size} />
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-[490px] bg-[#f7f6f5] p-6 md:p-7 flex flex-col">
                <Title text={name} size="md" className="font-extrabold mb-1" />
                <p className="text-gray-400">{textDetaills}</p>

                {/* Варіанти */}
                <div className="flex flex-col gap-4 mt-5">
                    <GroupVariants
                        items={availableSizes}
                        value={String(size)}
                        onClick={(value) => setSize(Number(value) as PizzaSize)}
                    />
                    <GroupVariants
                        items={pizzaTypes}
                        value={String(type)}
                        onClick={(value) => setType(Number(value) as PizzaType)}
                    />
                </div>

                {/* Інгредієнти */}
                <div className="bg-gray-50 p-5 rounded-md mt-5 overflow-y-auto max-h-[300px] md:max-h-[420px] scrollbar">
                    <div className="grid grid-cols-3 gap-3 grid-cols-2-xs">
                        {ingredients.map((ingredient) => (
                            <IngredientItem
                                key={ingredient.id}
                                name={ingredient.name}
                                price={ingredient.price}
                                imageUrl={ingredient.imageUrl}
                                onClick={() => addIngredient(ingredient.id)}
                                active={selectedIngredients.has(ingredient.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Кнопка */}
                <Button
                    loading={loading}
                    onClick={handleClickAddCart}
                    className="h-[50px] md:h-[55px] px-8 text-base rounded-[18px] w-full mt-6">
                    Додати в корзину за {totalPrice} ₴
                </Button>
            </div>
        </div>
    );
};
