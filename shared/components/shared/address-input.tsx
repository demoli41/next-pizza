'use client';

import React, { useRef } from "react";
import {  useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui";
import { ClearButton } from "./clear-button";

interface Props {
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
}

export const AddressInput: React.FC<Props> = ({ onChange,name="address",...props }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const {
        register,
        formState:{errors},
        watch,
        setValue,
    }=useFormContext();

    const value=watch(name);

  const inputRef = useRef<google.maps.places.SearchBox | null>(null);
  

  if (!apiKey) {
    return <div>API key is missing</div>;
  }


  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey as string, 
    libraries: ["places"],
  });

  const onClickClear=()=>{
    setValue(name,'',{shouldValidate:true});/*3 параметр для тригеру валідації після очистки поля */
}

  const handleOnPlacesChanged = () => {
    if (inputRef.current) {
      const places = inputRef.current.getPlaces();
      if (places && places.length > 0) {
        const address = places[0].formatted_address;
      }
    }
  };

  return isLoaded ? (
    <div >
      <StandaloneSearchBox
        onLoad={(ref) => (inputRef.current = ref)}
        onPlacesChanged={handleOnPlacesChanged}
      >
        <div className="relative">
            <Input {...register(name)} {...props}/>
            {value && <ClearButton onClick={onClickClear}/>}
        </div>
      </StandaloneSearchBox>
    </div>
  ) : (
    <div>Loading...</div>
  );
};