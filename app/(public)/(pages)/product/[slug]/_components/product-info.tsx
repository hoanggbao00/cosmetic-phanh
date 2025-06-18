"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/hooks/use-user"
import { useAddToWishlist, useIsInWishlist, useRemoveFromWishlist } from "@/queries/wishlist"
import { Heart, Minus, Plus, RotateCcw, Share2, ShieldCheck, Truck } from "lucide-react"
import { toast } from "sonner"

interface ProductInfoProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  product: any
  quantity: number
  setQuantity: (quantity: number) => void
  selectedSize: string | null
  setSelectedSize: (size: string) => void
  currentPrice: number
  onAddToCart: () => void
}

export default function ProductInfo({
  product,
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  currentPrice,
  onAddToCart,
}: ProductInfoProps) {
  const { data: user } = useUser()
  const { data: isInWishlist } = useIsInWishlist(user?.id ?? null, product.id)
  const { mutate: addToWishlist } = useAddToWishlist()
  const { mutate: removeFromWishlist } = useRemoveFromWishlist()

  const incrementQuantity = () => setQuantity(quantity + 1)
  const decrementQuantity = () => setQuantity(Math.max(1, quantity - 1))

  const onWishlist = () => {
    if (!user) {
      toast.error("Please login to add items to your wishlist")
      return
    }

    if (isInWishlist) {
      removeFromWishlist({
        productId: product.id,
        userId: user.id,
      })
    } else {
      addToWishlist({
        productId: product.id,
        userId: user.id,
      })
    }
  }

  const onShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Product Title and Rating */}
      <div className="mb-4">
        <h1 className="mb-2 font-bold text-2xl text-gray-900 md:text-3xl">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="font-bold text-2xl text-gray-900">${currentPrice.toFixed(2)}</span>
      </div>

      {/* Size Selection */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 font-medium text-gray-900 text-sm">Variants</h3>
          <RadioGroup
            value={selectedSize || ""}
            onValueChange={setSelectedSize}
            className="flex gap-3"
          >
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {product.variants.map((variant: any) => (
              <div key={variant.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={variant.name}
                  id={`size-${variant.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`size-${variant.id}`}
                  className="flex h-10 w-fit cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-2 font-medium text-gray-900 text-sm hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                >
                  {variant.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <h3 className="mb-3 font-medium text-gray-900 text-sm">Quantity</h3>
        <div className="flex w-32 items-center rounded-md border border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>

          <span className="flex-1 text-center font-medium text-sm">{quantity}</span>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={incrementQuantity}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Add to Cart and Wishlist */}
      <div className="mb-8 flex flex-row gap-3">
        <Button className="flex-1" size="lg" onClick={onAddToCart}>
          Add to Cart
        </Button>
        <Button
          variant={isInWishlist ? "default" : "outline"}
          size="icon"
          className="size-11"
          onClick={onWishlist}
        >
          <Heart className={isInWishlist ? "fill-current" : "h-5 w-5"} />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        <Button variant="outline" size="icon" className="size-11" onClick={onShare}>
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share product</span>
        </Button>
      </div>

      {/* Product Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 font-medium text-gray-900 text-sm">Highlights</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Shipping and Returns */}
      <div className="space-y-4 border-gray-200 border-t pt-6 text-sm">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Free shipping</p>
            <p className="text-gray-500">On orders over $50. Delivery in 3-5 business days.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Easy returns</p>
            <p className="text-gray-500">30-day return policy. No questions asked.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Satisfaction guaranteed</p>
            <p className="text-gray-500">Love it or get a full refund.</p>
          </div>
        </div>
      </div>

      {/* Ingredients Tab */}
      <div className="mt-auto pt-6">
        <Tabs defaultValue="ingredients">
          <TabsList className="w-full">
            <TabsTrigger value="ingredients" className="flex-1">
              Ingredients
            </TabsTrigger>
            <TabsTrigger value="how-to-use" className="flex-1">
              How to Use
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="mt-4 text-gray-600 text-sm">
            <p className="leading-relaxed">{product.ingredients}</p>
          </TabsContent>
          <TabsContent value="how-to-use" className="mt-4 text-gray-600 text-sm">
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: product.how_to_use }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
