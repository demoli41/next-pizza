'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Filters } from "@/shared/components/shared/filters";
import { Button } from "@/shared/components/ui/button";
import { Filter } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
}

export const FiltersDrawer: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("block lg:hidden mb-5", className)}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-center">
            Фільтри
            <Filter className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white w-[75%] sm:w-[300px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mb-4"></SheetTitle>
          </SheetHeader>
          <Filters className="w-[90%]"/>
        </SheetContent>
      </Sheet>
    </div>
  );
};
