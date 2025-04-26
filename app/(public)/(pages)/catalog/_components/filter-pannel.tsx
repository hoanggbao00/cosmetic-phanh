"use client";

import { FadeUpContainer, FadeUpItem } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { products } from "@/lib/data-product";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

export interface FilterState {
  categories: string;
  priceFrom: number;
  priceTo: number;
  colors: string;
}

type FilterKey = keyof FilterState;

export const FilterPanel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const maxPrice = Math.max(...products.map((product) => product.price));

  // Change filter will change url
  const handleFilterChange = useDebounceCallback((key: FilterKey, value: string) => {
    const params = new URLSearchParams(searchParams);

    // Categories split by comma
    const currentValue = params.get(key);

    if (key === "categories" && currentValue) {
      const values = currentValue.split(",");
      if (values.includes(value)) {
        values.splice(values.indexOf(value), 1);
      } else {
        values.push(value);
      }

      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
    } else if (currentValue && currentValue === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`?${params.toString()}`);
  }, 300);

  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    handleFilterChange("priceFrom", value[0].toString());
    handleFilterChange("priceTo", value[1].toString());
  };

  // Reset filters
  const resetFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("categories");
    params.delete("priceFrom");
    params.delete("priceTo");
    params.delete("colors");
    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const FilterItems = () => (
    <>
      {/* Categories */}
      <div className="border-b pb-4">
        <h3 className="font-medium">Categories</h3>

        <div className="mt-2 space-y-2">
          {["Makeup", "Skincare", "Body", "Fragrance"].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={searchParams.get("categories")?.includes(category)}
                onCheckedChange={() => handleFilterChange("categories", category)}
              />
              <label
                htmlFor={`category-${category}`}
                className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-b pb-4">
        <h3 className="font-medium">Price Range</h3>

        <div className="mt-4 space-y-4">
          <Slider
            defaultValue={[0, maxPrice]}
            max={maxPrice}
            step={1}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">${searchParams.get("priceFrom") ?? 0}</span>
            <span className="text-sm">${searchParams.get("priceTo") ?? maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="border-b pb-4">
        <h3 className="font-medium">Colors</h3>

        <div className="mt-2 space-y-2">
          {["Black", "White", "Red", "Pink", "Beige", "Clear", "Multi"].map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                defaultChecked={searchParams.get("colors")?.includes(color)}
                onCheckedChange={() => handleFilterChange("colors", color)}
              />
              <label
                htmlFor={`color-${color}`}
                className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="mb-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex w-full items-center justify-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <FilterItems />
            </div>
            <SheetFooter>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-sm">
                Reset All
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="hidden w-64 shrink-0 md:block">
      <div className="sticky top-20 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg">Filters</h2>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-sm">
            Reset All
          </Button>
        </div>

        <FadeUpContainer stagger={0.05} delay={0.1}>
          <FadeUpItem className="space-y-6">
            <FilterItems />
          </FadeUpItem>
        </FadeUpContainer>
      </div>
    </div>
  );
};
