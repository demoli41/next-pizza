import { Ingredient, ProductItem } from "@prisma/client";
import { PizzaSize, PizzaType } from "../constants/pizza";

/**
 * Функця для підрахунку ціни піци
 * @param type - тип тіста
 * @param size - розмір піци
 * @param items - список варіантів піци
 * @param ingredients - список інгредієнтів
 * @param selectedIngredients - вибрані інгредієнти
 * @returns number - загальна ціна піци
 */

export const calcTotalPizzaPrice = (
    type: PizzaType,
     size: PizzaSize,
      items: ProductItem[],
       ingredients: Ingredient[],
        selectedIngredients: Set<number>,
    ) => {
    const pizzaPrice = items.find((item) => item.pizzaType === type && item.size === size)?.price || 0;

    const totalIngredientPrice = ingredients.filter((ingredient) => selectedIngredients.has(ingredient.id)).reduce((
        acc, ingredient) => acc + ingredient.price, 0);

    return pizzaPrice + totalIngredientPrice;
}