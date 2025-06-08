"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useVariant } from "@/queries/variants"
import { useCartStore } from "@/stores/cart-store"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItemProps {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variantId?: string
  variantName?: string
  variantPrice?: number
}

export default function CartItem({
  id,
  name,
  price,
  image,
  quantity,
  variantId,
  variantName: initialVariantName,
  variantPrice: initialVariantPrice,
}: CartItemProps) {
  const { data: variant } = useVariant(variantId)
  const { removeItem, updateQuantity } = useCartStore()

  // Use variant data from API if available, otherwise fallback to initial values
  const displayName = variant?.name || initialVariantName
  const displayPrice = variant?.price || initialVariantPrice || price

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-lg">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 size-full object-cover"
          sizes="(max-width: 768px) 96px, 96px"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="font-medium">{name}</h3>
        {displayName && <p className="text-muted-foreground text-sm">{displayName}</p>}
        <p className="mt-1 font-medium">{formatPrice(displayPrice)}</p>

        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="ml-4 h-8 w-8"
            onClick={() => removeItem(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
