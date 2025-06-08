"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/stores/cart-store"
import type { Category, Product } from "@/types/tables"
import { ShoppingBagIcon } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  product: Product & {
    slug: string // Adding slug to fix type error
  }
  categories?: Category[]
}

export const ProductCard = ({ product, categories }: ProductCardProps) => {
  const { addItem } = useCartStore()

  function handleAddToCart() {
    // For product card, we only add the base product without variants
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? "",
      quantity: 1,
    })
  }

  return (
    <Card
      key={product.id}
      className="group h-full cursor-pointer rounded-none bg-transparent p-4 font-serif shadow-none md:p-8"
    >
      <CardContent className="flex flex-col items-center p-0">
        <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-secondary transition-all duration-300 group-hover:rounded-full">
          <img
            src={product.images?.[0] ?? ""}
            alt={product.name}
            className="size-full object-contain transition-all duration-300 group-hover:scale-110"
          />
          <Link href={`/product/${product.slug}`} className="absolute inset-0">
            <img
              src={product.images?.[1] ?? ""}
              alt={product.name}
              className="size-full scale-110 object-contain opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          </Link>
          {/* Button */}
          <div className="-translate-x-1/2 absolute bottom-0 left-1/2 min-w-[120px] opacity-0 transition-all duration-500 group-hover:bottom-[10%] group-hover:opacity-100">
            <div
              className="group/link relative rounded-full bg-primary px-2.5 py-1.5 text-white transition-colors duration-300 hover:bg-primary/70"
              onClick={handleAddToCart}
            >
              <span className="group-hover/link:-translate-y-1/2 group-hover/link:opacity-0">
                View Product
              </span>
              <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 opacity-0 transition-all duration-300 group-hover/link:opacity-100">
                <ShoppingBagIcon size={20} />
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-muted-foreground text-xs md:text-sm">
            {categories && (
              <Link
                key={product.category_id}
                href={`/products?category=${product.category_id}`}
                className="transition-colors duration-300 hover:text-primary"
              >
                {categories?.find((c) => c.id === product.category_id)?.name}
              </Link>
            )}
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="transition-colors duration-300 hover:text-primary"
          >
            <h3 className="font-medium text-xl md:text-2xl">{product.name}</h3>
          </Link>
          <p className="mt-1 text-xs md:text-sm">Starts From ${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
