"use client"
import { useProducts } from "@/app/admin/hooks/use-products"
import {
  calculateVoucherDiscount,
  useUpdateVoucherUsage,
  useVouchers,
} from "@/app/admin/hooks/use-vouchers"
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
import { cn, formatPrice } from "@/lib/utils"
import type { Order } from "@/types/tables/orders"
import { supabase } from "@/utils/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { OrderItemForm } from "./order-item-form"
import { type OrderFormValues, orderSchema } from "./schema"

export interface OrderState {
  id: string
  productId: string
  productName: string
  price: number
  variantId: string
  variantName: string
  variantPrice: number
  quantity: number
  totalPrice: number
}

interface OrderFormProps {
  order?: Order
}

export default function OrderForm({ order }: OrderFormProps) {
  const router = useRouter()
  const [orderItems, setOrderItems] = useState<OrderState[]>([])
  const [shippingAmount, setShippingAmount] = useState(order?.shipping_amount || 0)
  const [selectedVoucherId, setSelectedVoucherId] = useState(order?.voucher_id || "")

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      order_number: order?.order_number || "",
      guest_email: order?.guest_email || null,
      status: (order?.status as OrderFormValues["status"]) || "pending",
      payment_status: (order?.payment_status as OrderFormValues["payment_status"]) || "pending",
      payment_method: (order?.payment_method as OrderFormValues["payment_method"]) || "cash",
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
      order_items: [],
      customer_notes: order?.customer_notes || "",
      admin_notes: order?.admin_notes || "",
      voucher_id: order?.voucher_id || "",
      voucher_code: order?.voucher_code || "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "order_items",
  })

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useProducts()
  const { data: vouchers } = useVouchers()
  const updateVoucherUsage = useUpdateVoucherUsage()

  // Calculate subtotal from order items state
  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)

  // Calculate voucher discount
  const { discount: voucherDiscount, error: voucherError } = (() => {
    const selectedVoucher = vouchers?.find((v) => v.id === selectedVoucherId) || null
    return calculateVoucherDiscount(selectedVoucher, subtotal)
  })()

  // Calculate final total
  const finalTotal = subtotal + shippingAmount - (voucherDiscount || 0)

  // Initialize order items from existing order
  useEffect(() => {
    if (order?.order_items) {
      const initialItems = order.order_items.map((item) => ({
        id: Math.random().toString(36).substr(2, 9),
        productId: item.product_id || "",
        productName: item.product_name || "",
        price: item.price || 0,
        variantId: item.variant_id || "",
        variantName: item.variant_name || "",
        variantPrice: item.variant_price || 0,
        quantity: item.quantity || 1,
        totalPrice: item.total_price || 0,
      }))
      setOrderItems(initialItems)
    }
  }, [order])

  // Update form values before submit
  useEffect(() => {
    form.setValue("shipping_amount", shippingAmount)
    form.setValue("voucher_id", selectedVoucherId)
    form.setValue("discount_amount", voucherDiscount || 0)
    form.setValue("total_amount", finalTotal)
    form.setValue(
      "order_items",
      orderItems.map((item) => ({
        product_id: item.productId,
        product_name: item.productName,
        price: item.price,
        variant_id: item.variantId,
        variant_name: item.variantName,
        variant_price: item.variantPrice,
        quantity: item.quantity,
        total_price: item.totalPrice,
      }))
    )
  }, [form, orderItems, shippingAmount, selectedVoucherId, voucherDiscount, finalTotal])

  const handleAddItem = () => {
    const newItem: OrderState = {
      id: Math.random().toString(36).substr(2, 9),
      productId: "",
      productName: "",
      price: 0,
      variantId: "",
      variantName: "",
      variantPrice: 0,
      quantity: 1,
      totalPrice: 0,
    }
    setOrderItems((prev) => [...prev, newItem])
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

  const handleRemoveItem = (index: number, itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId))
    remove(index)
  }

  const handleUpdateItem = (itemId: string, updates: Partial<OrderState>) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...updates,
              totalPrice:
                ((updates.price || item.price) + (updates.variantPrice || item.variantPrice)) *
                (updates.quantity || item.quantity),
            }
          : item
      )
    )
  }

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

        const { error: orderError } = await supabase
          .from("orders")
          .insert({
            ...data,
            order_number: orderNumber,
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Only update voucher usage when creating a new order
        if (data.voucher_id) {
          await updateVoucherUsage.mutateAsync(data.voucher_id)
        }

        toast.success("Order created successfully")
        router.push("/admin/orders")
      } catch (error) {
        toast.error("Failed to create order")
        console.error("Failed to create order:", error)
      }
    }
  }

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
              <div className="max-h-[70svh] space-y-4 overflow-y-auto">
                {fields.map((_, index) => {
                  const orderItem = orderItems[index]
                  return orderItem ? (
                    <OrderItemForm
                      key={orderItem.id}
                      item={orderItem}
                      onRemove={() => handleRemoveItem(index, orderItem.id)}
                      onUpdate={(updates) => handleUpdateItem(orderItem.id, updates)}
                      products={products || []}
                    />
                  ) : null
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="w-full"
              >
                <PlusIcon className="mr-2" />
                Add Product
              </Button>
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
                      <FormLabel>Order Status</FormLabel>
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

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="shipping_address.full_name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="voucher_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Voucher</FormLabel>
                    <Select
                      value={selectedVoucherId}
                      onValueChange={(value) => {
                        setSelectedVoucherId(value)
                        const selectedVoucher = vouchers?.find((v) => v.id === value)
                        if (selectedVoucher) {
                          form.setValue("voucher_code", selectedVoucher.code)
                        } else {
                          form.setValue("voucher_code", "")
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full border-border">
                          <SelectValue placeholder="Select a voucher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vouchers?.map((voucher) => (
                          <SelectItem key={voucher.id} value={voucher.id}>
                            {voucher.name} -{" "}
                            {voucher.type === "percentage"
                              ? `${voucher.value}%`
                              : formatPrice(voucher.value)}
                            {voucher.minimum_order_amount
                              ? ` (Min: ${formatPrice(voucher.minimum_order_amount)})`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {voucherError && (
                      <p className="font-medium text-destructive text-sm">{voucherError}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        value={shippingAmount}
                        onChange={(e) => setShippingAmount(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between text-base">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div
                className={cn(
                  "flex items-center justify-between text-base",
                  voucherDiscount > 0 ? "text-green-600" : "text-destructive"
                )}
              >
                <span>
                  Voucher ({vouchers?.find((v) => v.id === selectedVoucherId)?.code || ""}):
                </span>
                <span>
                  {voucherDiscount > 0 ? `-${formatPrice(voucherDiscount)}` : voucherError}
                </span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span>Shipping:</span>
                <span>{formatPrice(shippingAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2 font-medium text-lg">
                <span>Total Amount:</span>
                <span>{formatPrice(finalTotal)}</span>
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
