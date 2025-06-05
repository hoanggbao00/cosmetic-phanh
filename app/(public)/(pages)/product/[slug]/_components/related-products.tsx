"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cart-store"
import type { Product } from "@/types/product.types"
import { Check, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface RelatedProductsProps {
  currentProductId: string
}

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  // Sample related products data
  const relatedProducts: Product[] = [
    {
      id: "101",
      name: "Hydrating Facial Cleanser",
      price: 28.99,
      rating: 4.7,
      image_primary: "/images/products/product_1_primary.png",
      image_secondary: "/images/products/product_1_secondary.png",
      category: ["Facial Cleanser"],
    },
    {
      id: "102",
      name: "Vitamin C Brightening Moisturizer",
      price: 42.99,
      rating: 4.9,
      image_primary: "/images/products/product_2_primary.png",
      image_secondary: "/images/products/product_2_secondary.png",
      category: ["Moisturizer"],
    },
    {
      id: "103",
      name: "Retinol Night Cream",
      price: 54.99,
      rating: 4.6,
      image_primary: "/images/products/product_3_primary.png",
      image_secondary: "/images/products/product_3_secondary.png",
      category: ["Night Cream"],
    },
    {
      id: "104",
      name: "Hyaluronic Acid Booster",
      price: 36.99,
      rating: 4.8,
      image_primary: "/images/products/product_1_primary.png",
      image_secondary: "/images/products/product_1_secondary.png",
      category: ["Acid Booster"],
    },
    {
      id: "105",
      name: "Exfoliating Facial Scrub",
      price: 24.99,
      rating: 4.5,
      image_primary: "/images/products/product_2_primary.png",
      image_secondary: "/images/products/product_2_secondary.png",
      category: ["Facial Scrub"],
    },
    {
      id: "106",
      name: "Peptide Eye Cream",
      price: 38.99,
      rating: 4.7,
      image_primary: "/images/products/product_3_primary.png",
      image_secondary: "/images/products/product_3_secondary.png",
      category: ["Eye Cream"],
    },
  ].filter((product) => product.id !== currentProductId)

  const productsPerPage = 4
  const totalPages = Math.ceil(relatedProducts.length / productsPerPage)
  const currentProducts = relatedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  )

  const nextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const handleAddToCart = (product: Product) => {
    setAddingToCart(product.id)

    // Simulate a slight delay for better UX
    setTimeout(() => {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image_primary,
        quantity: 1,
      })

      // Reset button state after 1.5 seconds
      setTimeout(() => {
        setAddingToCart(null)
      }, 1500)
    }, 500)
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <div className="-mt-14 absolute top-0 right-0 flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevPage} className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextPage} className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentProducts.map((product) => (
          <div key={product.id} className="group relative">
            <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
              <Link href={`/product/${product.id}`}>
                <div className="relative h-full w-full">
                  <img
                    src={product.image_primary || "/placeholder.svg"}
                    alt={product.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
              </Link>
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  <Link href={`/product/${product.id}`}>{product.name}</Link>
                </h3>
              </div>
              <p className="font-medium text-gray-900 text-sm">${product.price.toFixed(2)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => handleAddToCart(product)}
              disabled={addingToCart === product.id}
            >
              {addingToCart === product.id ? (
                <Check className="mr-1 h-4 w-4" />
              ) : (
                <ShoppingCart className="mr-1 h-4 w-4" />
              )}
              {addingToCart === product.id ? "Added" : "Add to Cart"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
