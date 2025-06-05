"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cart-store"
import type { Tables } from "@/types/supabase"
import { supabase } from "@/utils/supabase/client"
import { Check, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface RelatedProductsProps {
  currentProductId: string
  categoryId: string | null
}

export default function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Tables<"products">[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true)
      let query = supabase
        .from("products")
        .select("*")
        .neq("id", currentProductId)
        .eq("is_active", true)
        .limit(12)

      if (categoryId) {
        query = query.eq("category_id", categoryId)
      }

      const { data } = await query
      setRelatedProducts(data || [])
      setIsLoading(false)
    }

    fetchRelatedProducts()
  }, [currentProductId, categoryId])

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

  const handleAddToCart = (product: Tables<"products">) => {
    setAddingToCart(product.id)

    // Simulate a slight delay for better UX
    setTimeout(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: 1,
      })

      // Reset button state after 1.5 seconds
      setTimeout(() => {
        setAddingToCart(null)
      }, 1500)
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square w-full rounded-md bg-gray-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/4 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
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
              <Link href={`/product/${product.slug}`}>
                <div className="relative h-full w-full">
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
              </Link>
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  <Link href={`/product/${product.slug}`}>{product.name}</Link>
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
