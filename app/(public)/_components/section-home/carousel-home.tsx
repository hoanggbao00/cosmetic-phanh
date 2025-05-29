"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react"

export function CarouselHome() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

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

  const products = [
    {
      id: 1,
      name: "Natural Powder",
      image_primary: "/images/products/product_1_primary.png",
      image_secondary: "/images/products/product_1_secondary.png",
      priceFrom: 8.0,
      priceTo: 25.0,
    },
    {
      id: 2,
      name: "Matte Foundation",
      image_primary: "/images/products/product_2_primary.png",
      image_secondary: "/images/products/product_2_secondary.png",
      priceFrom: 12.0,
      priceTo: 30.0,
    },
    {
      id: 3,
      name: "Shimmer Blush",
      image_primary: "/images/products/product_3_primary.png",
      image_secondary: "/images/products/product_3_secondary.png",
      priceFrom: 10.0,
      priceTo: 22.0,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-[200px]">
      <Carousel setApi={setApi} className="w-full" plugins={[Autoplay({ delay: 5000 })]}>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <Card className="group border-none bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center p-0">
                  <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-full bg-secondary">
                    <img
                      src={product.image_primary}
                      alt={product.name}
                      className="size-full rounded-full object-contain"
                    />
                    <img
                      src={product.image_secondary}
                      alt={product.name}
                      className="absolute top-0 right-0 bottom-0 left-0 size-full scale-110 rounded-full object-contain opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-medium font-serif text-2xl">{product.name}</h3>
                    <p className="mt-1 text-sm">
                      Starts From ${product.priceFrom.toFixed(2)} – ${product.priceTo.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
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
