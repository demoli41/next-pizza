'use client';

import { Input } from "../../ui";
import { RequiredSymbol } from "../required-symbol";
import { ErrorText } from "../error-text";
import { ClearButton } from "../clear-button";
import { useFormContext } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    name:string;
    label?:string;
    required?:boolean;
    className?:string;
}

export const FormInput:React.FC<Props>=({
    className,
    name,
    label,
    required,
    ...props
})=>{

    const {
        register,
        formState:{errors},
        watch,
        setValue,
    }=useFormContext();


    const value=watch(name);
    const errorText=errors[name]?.message as string;

    const onClickClear=()=>{
        setValue(name,'',{shouldValidate:true});/*3 параметр для тригеру валідації після очистки поля */
    }

    return(
        <div className={className}>
                {    label && (
                    <p className="font-medium mb-2">
                        {label}
                        {required && <RequiredSymbol/>}
                    </p>
                )    }

                <div className="relative">
                    <Input className="h-12 text-md" {...register(name)} {...props} />      
                    {value && <ClearButton onClick={onClickClear}/>}
  
                </div>

                
                {errorText && <ErrorText text={errorText} className="mt-2"/>}
        </div>
    )
};