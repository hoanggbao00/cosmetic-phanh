"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useVariantDetails } from "@/queries/product-variants"
import { type CartItem as CartItemType, useCartStore } from "@/stores/cart-store"
import { Minus, Plus, X } from "lucide-react"
import { useEffect } from "react"

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity, updateVariantPrice } = useCartStore()
  const { data: variantDetails } = useVariantDetails(item.variantId ?? null)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (variantDetails && item.variantId) {
      updateVariantPrice(item.productId, item.variantId, variantDetails.price)
    }
  }, [variantDetails, item.productId, item.variantId])

  // Calculate total price: base price + variant price (if exists)
  const totalUnitPrice = variantDetails ? item.price + variantDetails.price : item.price

  return (
    <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-6">
      {/* Product Image and Info */}
      <div className="flex items-start gap-4 md:w-1/2">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
          <img
            src={item.image || "/placeholder.svg?height=80&width=80"}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-base text-gray-900">
            {item.name}
            {variantDetails && (
              <span className="ml-1 text-gray-500 text-sm">({variantDetails.name})</span>
            )}
          </h3>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="flex cursor-pointer items-center gap-1 text-red-300 text-xs hover:text-red-400"
          >
            <X size={12} />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Price - Mobile */}
      <div className="flex items-center justify-between md:hidden">
        <span className="font-medium text-sm">Price:</span>
        <div className="text-right">
          <span className="text-sm">${formatPrice(totalUnitPrice)}</span>
          {variantDetails && (
            <div className="text-gray-500 text-xs">
              (Base: ${formatPrice(item.price)} + Variant: ${formatPrice(variantDetails.price)})
            </div>
          )}
        </div>
      </div>

      {/* Price - Desktop */}
      <div className="hidden text-center md:block md:w-1/6">
        <span className="text-sm">${formatPrice(totalUnitPrice)}</span>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between md:w-1/6 md:justify-center">
        <span className="font-medium text-sm md:hidden">Quantity:</span>
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
            <span className="sr-only">Decrease quantity</span>
          </Button>

          <span className="w-8 text-center text-sm">{item.quantity}</span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Total - Mobile */}
      <div className="flex items-center justify-between md:hidden">
        <span className="font-medium text-sm">Total:</span>
        <span className="font-medium text-sm">${formatPrice(totalUnitPrice * item.quantity)}</span>
      </div>

      {/* Total - Desktop */}
      <div className="hidden text-right md:block md:w-1/6">
        <span className="font-medium text-sm">${formatPrice(totalUnitPrice * item.quantity)}</span>
      </div>
    </div>
  )
}
