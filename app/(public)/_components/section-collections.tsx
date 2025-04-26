"use client";

import { StarIcon } from "@/assets/icons/star-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/lib/data-product";
import { ChevronLeft, ChevronRight, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
  title: string;
  subTitle: string;
}

export const SectionCollections = ({ title, subTitle }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleProducts = products.slice(currentIndex, currentIndex + 4);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(products.length - 4, prev + 1));
  };

  return (
    <section className="w-full bg-white px-4 py-16 md:px-0">
      <div className="">
        {/* Title */}
        <div className="mx-auto mb-8 flex max-w-[1400px] items-center justify-between">
          <div className="font-serif">
            <div className="mb-2 flex items-center gap-2">
              <StarIcon className="size-4 animate-spin text-primary" />
              <span className="font-medium text-sm">{subTitle}</span>
            </div>
            <h2 className="font-semibold text-3xl text-primary md:text-4xl lg:text-5xl">{title}</h2>
          </div>

          {/* Pagination */}
          <div className="flex gap-2">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="rounded-md p-3 text-white disabled:opacity-50"
              size="icon"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentIndex >= products.length - 4}
              className="rounded-md p-3 text-white disabled:opacity-50"
              size="icon"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 font-serif md:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer rounded-none bg-transparent p-4 shadow-none first:border-r-0 last:border-l-0 md:p-8"
            >
              <CardContent className="flex flex-col items-center p-0">
                <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-secondary transition-all duration-300 group-hover:rounded-full">
                  <img src={product.image_primary} alt={product.name} className="size-full object-contain" />
                  <img
                    src={product.image_secondary}
                    alt={product.name}
                    className="absolute top-0 right-0 bottom-0 left-0 size-full scale-110 object-contain opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                  />
                  {/* Button */}
                  <div className="-translate-x-1/2 absolute bottom-0 left-1/2 opacity-0 transition-all duration-500 group-hover:bottom-[10%] group-hover:opacity-100">
                    <Link
                      href={`/product/${product.id}`}
                      className="group/link min-w-[150px] rounded-full bg-primary px-4 py-3 text-white transition-colors duration-300 hover:bg-primary/70"
                    >
                      <span className="group-hover/link:opacity-0">View Product</span>
                      <ShoppingBagIcon className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-4 opacity-0 transition-opacity duration-300 group-hover/link:opacity-100" />
                    </Link>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-muted-foreground text-sm">
                    {product.category.map((category, index) => (
                      <Link
                        key={category}
                        href={`/products?category=${category}`}
                        className="transition-colors duration-300 hover:text-primary"
                      >
                        {category}
                        {product.category[index + 1] && ", "}
                      </Link>
                    ))}
                  </div>
                  <h3 className="font-medium text-2xl">{product.name}</h3>
                  <p className="mt-1 text-sm">
                    Starts From ${product.priceFrom.toFixed(2)} – ${product.priceTo.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
