"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateOrder, useUpdateOrder } from "@/queries/orders"
import { useProductQuery } from "@/queries/product"
import type { Order } from "@/types/tables/orders"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import { type OrderSchema, orderSchema } from "./schema"

interface OrderFormProps {
  order?: Order
}

export default function OrderForm({ order }: OrderFormProps) {
  const router = useRouter()
  const { data: products } = useProductQuery()

  const form = useForm<OrderSchema>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      order_number: order?.order_number || "",
      guest_email: order?.guest_email || null,
      status: order?.status || "pending",
      payment_status: order?.payment_status || "pending",
      shipping_amount: order?.shipping_amount || 0,
      discount_amount: order?.discount_amount || 0,
      total_amount: order?.total_amount || 0,
      shipping_address: order?.shipping_address || {
        full_name: "",
        address_line1: "",
        address_line2: null,
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone: null,
      },
      order_items:
        order?.order_items?.map((item) => ({
          product_id: item.product_id || null,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price,
          product_name: item.product_name,
          variant_id: item.variant_id || null,
          variant_name: item.variant_name || null,
        })) || [],
      customer_notes: order?.customer_notes || null,
      admin_notes: order?.admin_notes || null,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "order_items",
  })

  const { mutate: createOrder } = useCreateOrder()
  const { mutate: updateOrder } = useUpdateOrder()

  // Watch order items to calculate totals
  const orderItems = form.watch("order_items")
  const shippingAmount = form.watch("shipping_amount") || 0
  const discountAmount = form.watch("discount_amount") || 0

  // Calculate totals whenever order items, shipping, or discount changes
  useEffect(() => {
    const subtotal = orderItems?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0
    const total = subtotal + shippingAmount - discountAmount

    form.setValue("total_amount", total)
  }, [orderItems, shippingAmount, discountAmount, form])

  const onSubmit = (values: OrderSchema) => {
    if (order) {
      updateOrder(
        { id: order.id, ...values },
        {
          onSuccess: () => {
            toast.success("Order updated successfully")
            router.push("/admin/orders")
          },
          onError: () => {
            toast.error("Failed to update order")
          },
        }
      )
    } else {
      createOrder(values, {
        onSuccess: () => {
          toast.success("Order created successfully")
          router.push("/admin/orders")
        },
        onError: () => {
          toast.error("Failed to create order")
        },
      })
    }
  }

  // Function to update item total price when quantity or price changes
  const updateItemTotalPrice = (index: number) => {
    const item = form.getValues(`order_items.${index}`)
    const totalPrice = item.price * item.quantity
    form.setValue(`order_items.${index}.total_price`, totalPrice)
  }

  // Function to handle product selection
  const handleProductSelect = (index: number, productId: string) => {
    const product = products?.find((p) => p.id === productId)
    if (product) {
      form.setValue(`order_items.${index}.product_id`, product.id)
      form.setValue(`order_items.${index}.product_name`, product.name)
      form.setValue(`order_items.${index}.price`, product.price)
      form.setValue(`order_items.${index}.variant_id`, undefined)
      form.setValue(`order_items.${index}.variant_name`, undefined)
      updateItemTotalPrice(index)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Basic Information</h3>
            <FormField
              control={form.control}
              name="order_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guest_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Amounts */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Amounts</h3>
            <FormField
              control={form.control}
              name="subtotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
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
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
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
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Shipping Address</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <Input {...field} type="tel" value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping_address.address_line1"
              render={({ field }) => (
                <FormItem>
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
              name="shipping_address.address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
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
            <FormField
              control={form.control}
              name="shipping_address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping_address.postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping_address.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customer_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ""} />
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
                  <Textarea {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">Order Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  product_id: "",
                  product_name: "",
                  variant_id: null,
                  variant_name: null,
                  price: 0,
                  quantity: 1,
                  total_price: 0,
                })
              }
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4 rounded-lg border p-4">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                              <SelectTrigger>
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
                      name={`order_items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              onChange={(e) => {
                                field.onChange(Number(e.target.value))
                                updateItemTotalPrice(index)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`order_items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(Number(e.target.value))
                                updateItemTotalPrice(index)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`order_items.${index}.total_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mt-8"
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium text-lg">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(form.watch("subtotal"))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(form.watch("shipping_amount"))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(form.watch("discount_amount"))}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 font-medium">
              <span>Total:</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(form.watch("total_amount"))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/orders")}>
            Cancel
          </Button>
          <Button type="submit">{order ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  )
}
