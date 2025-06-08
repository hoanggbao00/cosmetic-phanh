"use client"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCartStore } from "@/stores/cart-store"
import type { Tables } from "@/types/supabase"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import ProductGallery from "./product-gallery"
import ProductInfo from "./product-info"
import ProductReviews from "./product-reviews"
import RelatedPosts from "./related-posts"
import RelatedProducts from "./related-products"

type ProductWithRelations = Tables<"products"> & {
  brand: Tables<"brands">
  category: Tables<"categories">
  reviews: (Tables<"product_reviews"> & {
    user: Pick<Tables<"profiles">, "id" | "full_name" | "avatar_url">
  })[]
  variants: Tables<"product_variants">[]
  tags?: string[]
}

interface ProductDetailProps {
  product: ProductWithRelations
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  // Convert variants to sizes
  const sizes = product.variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    price: variant.price,
  }))

  // Handle size selection
  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0].name)
    }
  }, [sizes, selectedSize])

  // Get current price based on selected size
  const getCurrentPrice = () => {
    if (!selectedSize) return product.price
    const size = sizes.find((s) => s.name === selectedSize)
    return size ? size.price : product.price
  }

  // Calculate average rating
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0

  // Handle add to cart
  const handleAddToCart = () => {
    const selectedVariant = selectedSize
      ? product.variants.find((v) => v.name === selectedSize)
      : undefined

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantPrice: selectedVariant?.price,
    }

    addItem(cartItem)
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Product Detail Section */}
        <div className="mb-16 flex flex-col gap-8 lg:flex-row">
          {/* Product Gallery */}
          <div className="lg:w-1/2">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <ProductInfo
              product={{
                ...product,
                sizes,
                rating: averageRating,
                reviewCount: product.reviews.length,
                features: product.tags || [],
              }}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              currentPrice={getCurrentPrice()}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-16">
          <Collapsible className="rounded-lg border border-accent">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                icon={ChevronDown}
                iconPlacement="right"
                className="w-full justify-between"
              >
                <h2 className="font-bold text-2xl">Product Details</h2>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <div
                className="prose prose-sm md:prose-base lg:prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <ProductReviews productId={product.id} reviews={product.reviews} />
        </div>

        {/* Related Products */}
        <div className="mb-16">
          <h2 className="mb-6 font-bold text-2xl">You May Also Like</h2>
          <RelatedProducts currentProductId={product.id} categoryId={product.category_id} />
        </div>

        {/* Related Posts */}
        <div className="mb-16">
          <h2 className="mb-6 font-bold text-2xl">Related Articles</h2>
          <RelatedPosts />
        </div>
      </div>
    </div>
  )
}
