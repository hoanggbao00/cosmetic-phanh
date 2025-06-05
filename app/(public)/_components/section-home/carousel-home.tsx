"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import { useFeaturedProductsQuery } from "@/queries/product"
import { useProductVariantsQuery } from "@/queries/product-variants"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react"

export function CarouselHome() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { data: products = [], isLoading } = useFeaturedProductsQuery(3)
  const { data: variants = [] } = useProductVariantsQuery()

  useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  // Get price range for each product from its variants
  const getProductPriceRange = (productId: string) => {
    const productVariants = variants.filter((v) => v.product_id === productId)
    if (productVariants.length === 0) return { priceFrom: 0, priceTo: 0 }

    const prices = productVariants.map((v) => v.price)
    return {
      priceFrom: Math.min(...prices),
      priceTo: Math.max(...prices),
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mx-auto w-full max-w-[200px]">
      <Carousel setApi={setApi} className="w-full" plugins={[Autoplay({ delay: 5000 })]}>
        <CarouselContent>
          {products.map((product) => {
            const { priceFrom, priceTo } = getProductPriceRange(product.id)
            return (
              <CarouselItem key={product.id}>
                <Card className="group border-none bg-transparent shadow-none">
                  <CardContent className="flex flex-col items-center p-0">
                    <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-full bg-secondary">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="size-full rounded-full object-contain"
                      />
                      <img
                        src={product.images?.[1]}
                        alt={product.name}
                        className="absolute top-0 right-0 bottom-0 left-0 size-full scale-110 rounded-full object-contain opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="font-medium font-serif text-2xl">{product.name}</h3>
                      <p className="mt-1 text-sm">
                        Starts From ${priceFrom.toFixed(2)} – ${priceTo.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
      <div className="mt-2 flex justify-center gap-2">
        {products.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn("text-2xl", current === index ? "text-primary" : "text-primary/80")}
            aria-label={`Go to slide ${index + 1}`}
          >
            {current === index ? "✦" : "•"}
          </button>
        ))}
      </div>
    </div>
  )
}
