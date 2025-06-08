"use client"

import { getProductVariants } from "@/app/admin/actions/get-product-variants"
import { Button } from "@/components/ui/button"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/tables/products"
import { useQuery } from "@tanstack/react-query"
import { MinusIcon } from "lucide-react"
import type { OrderState } from "./order-form"

interface OrderItemFormProps {
  item: OrderState
  onRemove: () => void
  onUpdate: (updates: Partial<OrderState>) => void
  products: Product[]
}

export function OrderItemForm({ item, onRemove, onUpdate, products }: OrderItemFormProps) {
  // Query for variants with a unique key including the product
  const { data: variants = [], isLoading: isLoadingVariants } = useQuery({
    queryKey: ["variants", item.productId],
    queryFn: () => getProductVariants(item.productId),
    enabled: !!item.productId,
  })

  return (
    <div className="space-y-4 rounded-lg border p-4">
      {item.productId && (
        <div className="relative mb-4">
          {products?.find((p) => p.id === item.productId)?.images?.[0] && (
            <div className="relative aspect-square w-20 overflow-hidden rounded-lg border">
              <img
                src={products.find((p) => p.id === item.productId)?.images[0] || ""}
                alt={item.productName || "Product image"}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0"
            onClick={onRemove}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <FormItem>
            <FormLabel>Product</FormLabel>
            <Select
              value={item.productId}
              onValueChange={(value) => {
                const product = products?.find((p) => p.id === value)
                if (product) {
                  onUpdate({
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    variantId: "",
                    variantName: "",
                    variantPrice: 0,
                  })
                }
              }}
            >
              <FormControl>
                <SelectTrigger className="w-full border-border">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </div>

        {variants.length > 0 && (
          <div className="flex-1">
            <FormItem>
              <FormLabel>Variant</FormLabel>
              <Select
                value={item.variantId}
                onValueChange={(value) => {
                  const variant = variants.find((v) => v.id === value)
                  if (variant) {
                    onUpdate({
                      variantId: variant.id,
                      variantName: variant.name,
                      variantPrice: variant.price,
                    })
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full border-border" disabled={isLoadingVariants}>
                    <SelectValue
                      placeholder={isLoadingVariants ? "Loading..." : "Select a variant"}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.name} - {formatPrice(variant.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </div>
        )}

        <div className="w-[100px]">
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = Math.max(1, Number.parseInt(e.target.value) || 0)
                  onUpdate({ quantity: newQuantity })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      </div>
      <div className="mb-2 text-right">
        <div className="space-y-1">
          <p className="font-medium text-lg">{formatPrice(item.totalPrice)}</p>
        </div>
      </div>
    </div>
  )
}
