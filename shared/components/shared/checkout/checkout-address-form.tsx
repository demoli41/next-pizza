'use client';

import React from "react";
import { WhiteBlock } from "../white-block";
import { FormTextarea } from "../form";
import { AddressInput } from "../address-input";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorText } from "../error-text";



interface Props {
  className?: string;
}



export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {

  const {control} = useFormContext();

 

 return(
    <WhiteBlock title="3. Адрес доставки" className={className}>
    <div className="flex flex-col gap-5">
      <Controller
      control={control}
      name="address"
      render={({field,fieldState}) =><>
       <AddressInput label="Введіть адресу" onChange={field.onChange} />
       {fieldState.error?.message && <ErrorText text={fieldState.error.message}/>}
      </>}
      />
       <FormTextarea
       name="comment"
       className="text-base"
       rows={5}
       placeholder="Коментар до замовлення"
       />
    </div>
   </WhiteBlock>
 );
};