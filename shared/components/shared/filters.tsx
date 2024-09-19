'use client';

import { Title } from "@/shared/components/shared/title";
import React from "react";
import { Input } from "@/shared/components/ui/input";
import { RangeSlider } from "@/shared/components/shared/range-slider";
import { CheckboxFiltersGroup } from "@/shared/components/shared/checkbox-filters-group";
import { useQueryFilters,useFilters,useIngredients } from "@/shared/hooks";

interface Props {
  className?: string;
}



export const Filters: React.FC<Props> = ({ className }) => {
    const{ingredients,loading}=useIngredients();
    const filters=useFilters();

    useQueryFilters(filters);

    const items=ingredients.map((item)=>({value: String(item.id), text:item.name}));

    const updatePrices=(prices:number[])=>{
        console.log(prices);
        filters.setPrices('priceForm',prices[0]);
        filters.setPrices('priceTo',prices[1]);
    }

    return(
        <div className={className}>
            <Title text='Фільтри' size='sm' className='mb-5 font-bold'/>

            <CheckboxFiltersGroup
           title='Тип тіста'
           name="pizzaTypes"
           className='mb-5'
           onClickCheckbox={filters.setPizzaTypes}
           selected={filters.pizzaTypes}
           items={[
            {text:'Тонке',value:'1'},
            {text:'Класичне',value:'2'},
           ]}
           />
    
             
            <CheckboxFiltersGroup
           title='Розміри'
           name="sizes"
           className='mb-5'
           onClickCheckbox={filters.setSizes}
           selected={filters.sizes}
           items={[
            {text:'20 см',value:'20'},
            {text:'30 см',value:'30'},
            {text:'40 см',value:'40'},
           ]}
           />

            <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
                <p className="font-bold mb-3">Ціна від і до</p>
                <div className="flex gap-3 mb-5">
                    <Input 
                    type="number" 
                    placeholder="0" 
                    min={0} max={1000} 
                    value={String(filters.prices.priceForm)} 
                    onChange={(e)=>filters.setPrices('priceForm',Number(e.target.value))}/>
                    <Input 
                    type="number" 
                    placeholder="1000" 
                    min={100} 
                    value={String(filters.prices.priceTo)} 
                    max={1000} 
                    onChange={(e)=>filters.setPrices('priceTo',Number(e.target.value))}
                    />
                </div>

                <RangeSlider 
                min={0} 
                max={1000} 
                step={10} value={[
                    filters.prices.priceForm || 0,
                    filters.prices.priceTo || 1000,
                ]}
                onValueChange={updatePrices}
                />

            </div>
           
           <CheckboxFiltersGroup
           title='Інгредієнти'
           name="ingredients"
           className='mt-5'
           limit={6}
           defaultItems={items.slice(0,6)}
           items={items}
           loading={loading}
           onClickCheckbox={filters.setSelectedIngredients}
           selected={filters.selectedIngredients}
           />

        </div>
    );
};