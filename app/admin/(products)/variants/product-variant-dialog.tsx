"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useProductQuery } from "@/queries/product"
import { useCreateProductVariant, useUpdateProductVariant } from "@/queries/product-variants"
import type { ProductVariant } from "@/types/tables/product_variants"
import { useEffect } from "react"

const formSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  old_price: z.number().nullable(),
  price: z.number().min(0, "Price must be positive"),
  stock_quantity: z.number().min(0, "Stock quantity must be positive"),
  variant_options: z.any().nullable(),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface ProductVariantDialogProps {
  variant?: ProductVariant | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export default function ProductVariantDialog({
  variant,
  open,
  onOpenChange,
  onClose,
}: ProductVariantDialogProps) {
  const { data: products, isLoading: isLoadingProducts } = useProductQuery()
  const { mutate: createVariant } = useCreateProductVariant()
  const { mutate: updateVariant } = useUpdateProductVariant()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: variant?.product_id || "",
      name: variant?.name || "",
      old_price: variant?.old_price || null,
      price: variant?.price || 0,
      stock_quantity: variant?.stock_quantity || 0,
      variant_options: variant?.variant_options || null,
      is_active: variant?.is_active ?? true,
    },
  })

  const onSubmit = (values: FormValues) => {
    if (variant) {
      updateVariant(
        { id: variant.id, ...values },
        {
          onSuccess: () => {
            onClose()
            form.reset()
          },
        }
      )
    } else {
      createVariant(values, {
        onSuccess: () => {
          onClose()
          form.reset()
        },
      })
    }
  }

  useEffect(() => {
    if (variant) {
      form.reset({
        product_id: variant.product_id,
        name: variant.name,
        old_price: variant.old_price,
        price: variant.price,
        stock_quantity: variant.stock_quantity,
        variant_options: variant.variant_options,
        is_active: variant.is_active,
      })
    }
  }, [variant, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{variant ? "Edit Variant" : "Create Variant"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    disabled={isLoadingProducts}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="old_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="stock_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{variant ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
