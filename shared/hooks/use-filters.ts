import { useRouter, useSearchParams } from "next/navigation";
import { useSet } from "react-use";
import React from "react";

interface QueryFilters extends PriceProps{
    pizzaTypes: string;
    sizes: string;
    ingredients: string;
}

interface PriceProps{
    priceForm?:number;
    priceTo?:number;
}

export interface Filters{
    sizes: Set<string>;
    pizzaTypes: Set<string>;
    selectedIngredients: Set<string>;
    prices: PriceProps;
}

interface ReturnProps extends Filters{
    setPrices:(name:keyof PriceProps, value:number)=>void;
    setPizzaTypes:(value:string)=>void;
    setSizes:(value:string)=>void;
    setSelectedIngredients:(value:string)=>void;
}

export const useFilters=():ReturnProps=>{
    const searchParams=useSearchParams() as unknown as Map<keyof QueryFilters,string>;


/*filter ingredients*/ 
    const [selectedIngredients, { toggle:toggleIngredients }] = useSet(
        new Set<string>(searchParams.get('ingredients')?.split(',')));



/*filter sizes*/ 
    const [sizes, { toggle: toggleSizes }] = useSet(
        new Set<string>(searchParams.get('sizes') ? searchParams.get('sizes')?.split(',') : []));
/*filter pizza types*/ 
    const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
            new Set<string>(searchParams.get('pizzaTypes') ? searchParams.get('pizzaTypes')?.split(',') : []));
/*filter cost*/ 
    const [prices,setPrices]=React.useState<PriceProps>({
                priceForm:Number(searchParams.get('priceForm')) || undefined,
                priceTo:Number(searchParams.get('priceTo')) || undefined,
            });

            const updatePrice=(name:keyof PriceProps, value:number)=>{
                setPrices((prev)=>({
                    ...prev,
                    [name]:value,
                }));
            };

            

return React.useMemo(
    ()=>({
                sizes,
                pizzaTypes,
                selectedIngredients,
                prices,
                setPrices:updatePrice,
                setPizzaTypes:togglePizzaTypes,
                setSizes:toggleSizes,
                setSelectedIngredients:toggleIngredients,
            }),

            [sizes,pizzaTypes,selectedIngredients,prices],
        );
}  