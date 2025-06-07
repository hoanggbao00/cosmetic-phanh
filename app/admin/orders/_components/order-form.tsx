"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import type * as z from "zod"

import { useMultipleProductVariants } from "@/app/admin/hooks/use-product-variants"
import { useProducts } from "@/app/admin/hooks/use-products"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Order } from "@/types/tables/orders"
import type { ProductVariant } from "@/types/tables/product_variants"
import type { Product } from "@/types/tables/products"
import { supabase } from "@/utils/supabase/client"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useEffect, useMemo } from "react"
import { toast } from "sonner"
import { orderSchema } from "./schema"

type OrderFormValues = z.infer<typeof orderSchema>

interface OrderFormProps {
  order?: Order
}

export default function OrderForm({ order }: OrderFormProps) {
  const router = useRouter()

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      order_number: order?.order_number || "",
      guest_email: order?.guest_email || null,
      status: order?.status || "pending",
      payment_status: order?.payment_status || "pending",
      payment_method: order?.payment_method || "cash",
      shipping_amount: order?.shipping_amount || 0,
      discount_amount: order?.discount_amount || 0,
      total_amount: order?.total_amount || 0,
      shipping_address: {
        full_name: order?.shipping_address?.full_name || "",
        address_line1: order?.shipping_address?.address_line1 || "",
        address_line2: order?.shipping_address?.address_line2 || "",
        city: order?.shipping_address?.city || "",
        phone: order?.shipping_address?.phone || "",
      },
      order_items:
        order?.order_items?.map((item) => ({
          product_id: item.product_id || "",
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price,
          product_name: item.product_name,
          variant_id: item.variant_id || "",
          variant_name: item.variant_name || "",
        })) || [],
      customer_notes: order?.customer_notes || "",
      admin_notes: order?.admin_notes || "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "order_items",
  })

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useProducts()

  // Get all product IDs from order items
  const orderItems = form.watch("order_items")
  const productIds = orderItems.map((item) => item.product_id).filter(Boolean)

  // Fetch variants for all products at once
  const variantQueries = useMultipleProductVariants(productIds)

  // Create a map to store variants for each product
  const variantsMap = useMemo(() => {
    const map = new Map<string, ProductVariant[]>()
    productIds.forEach((productId, index) => {
      const { data: variants } = variantQueries[index]
      if (variants) {
        map.set(productId, variants)
      }
    })
    return map
  }, [productIds, variantQueries])

  const shippingAmount = form.watch("shipping_amount") || 0
  const discountAmount = form.watch("discount_amount") || 0

  // Calculate totals whenever order items, shipping, or discount changes
  useEffect(() => {
    const subtotal = orderItems?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0
    const total = subtotal + shippingAmount - discountAmount

    form.setValue("total_amount", total)
  }, [orderItems, shippingAmount, discountAmount, form])

  const onSubmit = async (data: OrderFormValues) => {
    if (order) {
      try {
        const { error } = await supabase
          .from("orders")
          .update(data)
          .eq("id", order.id)
          .select()
          .single()

        if (error) throw error

        toast.success("Order updated successfully")
        router.push("/admin/orders")
      } catch (error) {
        toast.error("Failed to update order")
        console.error("Failed to update order:", error)
      }
    } else {
      try {
        // Generate order number with date
        const now = new Date()
        const orderNumber = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

        const { error } = await supabase
          .from("orders")
          .insert({
            ...data,
            order_number: orderNumber,
          })
          .select()
          .single()

        if (error) throw error

        toast.success("Order created successfully")
        router.push("/admin/orders")
      } catch (error) {
        toast.error("Failed to create order")
        console.error("Failed to create order:", error)
      }
    }
  }

  // Function to update item total price when quantity or price changes
  const updateItemTotalPrice = (index: number) => {
    const item = form.getValues(`order_items.${index}`)
    const basePrice = item.price || 0
    const variantPrice = item.variant_price || 0
    const totalPrice = (basePrice + variantPrice) * item.quantity
    form.setValue(`order_items.${index}.total_price`, totalPrice)
  }

  // Function to handle product selection
  const handleProductSelect = (index: number, productId: string) => {
    const product = products?.find((p: Product) => p.id === productId)
    if (product) {
      form.setValue(`order_items.${index}.product_id`, product.id)
      form.setValue(`order_items.${index}.product_name`, product.name)
      form.setValue(`order_items.${index}.price`, product.price)
      form.setValue(`order_items.${index}.variant_id`, "")
      form.setValue(`order_items.${index}.variant_name`, "")
      form.setValue(`order_items.${index}.variant_price`, 0)
      form.setValue(`order_items.${index}.quantity`, 1)
      updateItemTotalPrice(index)
    }
  }

  // Calculate subtotal from order items
  const subtotal = orderItems?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0

  if (isLoadingProducts) {
    return <div>Loading products...</div>
  }

  if (productsError) {
    return <div>Error loading products. Please try again.</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Products & Customer Notes */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Order Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    product_id: "",
                    product_name: "",
                    variant_id: "",
                    variant_name: "",
                    price: 0,
                    quantity: 1,
                    total_price: 0,
                    variant_price: 0,
                  })
                }
                className="w-full"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Product
              </Button>

              {fields.map((field, index) => {
                const currentProductId = form.watch(`order_items.${index}.product_id`)
                const variants = variantsMap.get(currentProductId) || []

                return (
                  <div key={field.id} className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Product {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`order_items.${index}.product_id`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={(value) => handleProductSelect(index, value)}
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
                          )}
                        />
                      </div>

                      {variants.length > 0 && (
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`order_items.${index}.variant_id`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Variant</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    const variant = variants.find(
                                      (v: ProductVariant) => v.id === value
                                    )
                                    if (variant) {
                                      form.setValue(`order_items.${index}.variant_id`, variant.id)
                                      form.setValue(
                                        `order_items.${index}.variant_name`,
                                        variant.name
                                      )
                                      form.setValue(
                                        `order_items.${index}.variant_price`,
                                        variant.price
                                      )
                                      updateItemTotalPrice(index)
                                    }
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full border-border">
                                      <SelectValue placeholder="Select a variant" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {variants.map((variant: ProductVariant) => (
                                      <SelectItem key={variant.id} value={variant.id}>
                                        {variant.name} - ${variant.price}
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
                          control={form.control}
                          name={`order_items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(Number.parseInt(e.target.value))
                                    updateItemTotalPrice(index)
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
                        control={form.control}
                        name={`order_items.${index}.total_price`}
                        render={({ field }) => (
                          <div className="space-y-1">
                            <FormLabel>Total</FormLabel>
                            <p className="font-medium text-lg">${field.value || 0}</p>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <FormField
              control={form.control}
              name="customer_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column - Order Details */}
          <div className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash">Cash</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="online_banking" id="online_banking" />
                          <Label htmlFor="online_banking">Online Banking</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full border-border">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full border-border">
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shipping_address.full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shipping_address.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="shipping_address.address_line1"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shipping_address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shipping_address.address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admin_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shipping_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between font-medium text-lg">
                <span>Total Amount:</span>
                <span>${subtotal + shippingAmount - discountAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/orders")}>
            Cancel
          </Button>
          <Button type="submit">{order ? "Update Order" : "Create Order"}</Button>
        </div>
      </form>
    </Form>
  )
}
