"use client"

import { StarIcon } from "@/assets/icons/star-icon"
import { Button } from "@/components/ui/button"
import {} from "@/components/ui/card"
import { products } from "@/lib/data-product"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { ProductCard } from "../(pages)/catalog/_components/product-card"

interface Props {
  title: string
  subTitle: string
}

export const SectionCollections = ({ title, subTitle }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const visibleProducts = products.slice(currentIndex, currentIndex + 4)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(products.length - 4, prev + 1))
  }

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
