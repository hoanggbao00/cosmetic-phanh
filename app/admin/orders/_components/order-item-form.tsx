"use client"

import { getProductVariants } from "@/app/admin/actions/get-product-variants"
import { useProducts } from "@/app/admin/hooks/use-products"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { MinusIcon } from "lucide-react"
import { type Control, useFormContext } from "react-hook-form"
import type { OrderFormValues } from "./schema"

interface OrderItemFormProps {
  control: Control<OrderFormValues>
  index: number
  onRemove: (index: number) => void
  onProductSelect: (index: number, productId: string) => void
  onQuantityChange: () => void
}

export function OrderItemForm({
  control,
  index,
  onRemove,
  onProductSelect,
  onQuantityChange,
}: OrderItemFormProps) {
  const { data: products } = useProducts()
  const form = useFormContext<OrderFormValues>()
  const queryClient = useQueryClient()

  // Get the current product ID for this item
  const productId = form.watch(`order_items.${index}.product_id`)

  // Query for variants with a unique key including the index
  const { data: variants = [], isLoading: isLoadingVariants } = useQuery({
    queryKey: ["variants", productId],
    queryFn: () => getProductVariants(productId),
    enabled: !!productId,
  })

  // Handle product selection and prefetch variants
  const handleProductChange = async (value: string) => {
    // Clear variant selection when product changes
    form.setValue(`order_items.${index}.variant_id`, "")
    form.setValue(`order_items.${index}.variant_name`, "")
    form.setValue(`order_items.${index}.variant_price`, 0)

    // Call parent handler
    onProductSelect(index, value)

    // Prefetch variants for the new product
    if (value) {
      await queryClient.prefetchQuery({
        queryKey: ["variants", value],
        queryFn: () => getProductVariants(value),
      })
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      {productId && (
        <div className="relative mb-4">
          {products?.find((p) => p.id === productId)?.images?.[0] && (
            <div className="relative aspect-square w-20 overflow-hidden rounded-lg border">
              <img
                src={products.find((p) => p.id === productId)?.images[0] || ""}
                alt={form.watch(`order_items.${index}.product_name`) || "Product image"}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0"
            onClick={() => onRemove(index)}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <FormField
            control={control}
            name={`order_items.${index}.product_id`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select value={field.value} onValueChange={handleProductChange}>
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
            )}
          />
        </div>

        {variants.length > 0 && (
          <div className="flex-1">
            <FormField
              control={control}
              name={`order_items.${index}.variant_id`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      const variant = variants.find((v) => v.id === value)
                      if (variant) {
                        form.setValue(`order_items.${index}.variant_id`, variant.id)
                        form.setValue(`order_items.${index}.variant_name`, variant.name)
                        form.setValue(`order_items.${index}.variant_price`, variant.price)
                        onQuantityChange()
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
              )}
            />
          </div>
        )}

        <div className="w-[100px]">
          <FormField
            control={control}
            name={`order_items.${index}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => {
                      const newQuantity = Math.max(1, Number.parseInt(e.target.value) || 0)
                      field.onChange(newQuantity)
                      onQuantityChange()
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="mb-2 text-right">
        <FormField
          control={control}
          name={`order_items.${index}.total_price`}
          render={({ field }) => (
            <div className="space-y-1">
              <p className="font-medium text-lg">
                {field.value ? formatPrice(field.value) : formatPrice(0)}
              </p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
