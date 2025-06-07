"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useUpdateOrder } from "@/queries/orders"
import type { Order } from "@/types/tables/orders"
import { format } from "date-fns"
import { ArrowLeftIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface OrderDetailProps {
  order: Order
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter()
  const { mutate: updateOrder, isPending } = useUpdateOrder()

  const handleUpdateStatus = async (status: Order["status"]) => {
    if (window.confirm(`Are you sure you want to update order status to ${status}?`)) {
      updateOrder(
        { id: order.id, status },
        {
          onSuccess: () => {
            router.refresh()
          },
          onError: (error: Error) => {
            console.error("Failed to update status:", error)
          },
        }
      )
    }
  }

  const handleUpdatePaymentStatus = async (payment_status: Order["payment_status"]) => {
    if (window.confirm(`Are you sure you want to update payment status to ${payment_status}?`)) {
      updateOrder(
        { id: order.id, payment_status },
        {
          onSuccess: () => {
            router.refresh()
          },
          onError: (error: Error) => {
            console.error("Failed to update payment status:", error)
          },
        }
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/admin/orders" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {isPending && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Updating...
            </div>
          )}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Order Status:</span>
              <Badge
                variant={
                  order.status === "delivered"
                    ? "default"
                    : order.status === "processing" || order.status === "confirmed"
                      ? "secondary"
                      : order.status === "cancelled" || order.status === "refunded"
                        ? "destructive"
                        : "outline"
                }
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Payment Status:</span>
              <Badge
                variant={
                  order.payment_status === "paid"
                    ? "default"
                    : order.payment_status === "pending"
                      ? "secondary"
                      : order.payment_status === "failed"
                        ? "destructive"
                        : "outline"
                }
              >
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">Order Number</div>
                <div className="font-medium">{order.order_number}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Created At</div>
                <div className="font-medium">{format(new Date(order.created_at), "PPP")}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Payment Method</div>
                <div className="font-medium capitalize">
                  {order.payment_method.replace("_", " ")}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Customer</div>
                <div className="font-medium">{order.guest_email || order.user_id || "-"}</div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-muted-foreground text-sm">Shipping Address</div>
              <div className="mt-1 space-y-1">
                <div className="font-medium">{order.shipping_address.full_name}</div>
                <div>{order.shipping_address.address_line1}</div>
                {order.shipping_address.address_line2 && (
                  <div>{order.shipping_address.address_line2}</div>
                )}
                <div>{order.shipping_address.city}</div>
                <div>{order.shipping_address.phone}</div>
              </div>
            </div>

            {order.customer_notes && (
              <>
                <Separator />
                <div>
                  <div className="text-muted-foreground text-sm">Customer Notes</div>
                  <div className="mt-1">{order.customer_notes}</div>
                </div>
              </>
            )}

            {order.admin_notes && (
              <>
                <Separator />
                <div>
                  <div className="text-muted-foreground text-sm">Admin Notes</div>
                  <div className="mt-1">{order.admin_notes}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                {item.product?.images?.[0] && (
                  <div className="relative aspect-square h-16 w-16 overflow-hidden rounded-lg">
                    <img
                      src={item.product.images[0]}
                      alt={item.product_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    {item.variant_name && (
                      <div className="text-muted-foreground text-sm">{item.variant_name}</div>
                    )}
                    <div className="text-muted-foreground text-sm">Quantity: {item.quantity}</div>
                  </div>
                  <div className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(item.price)}
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Subtotal</div>
                <div>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    order.order_items?.reduce((total, item) => total + item.total_price, 0) || 0
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Shipping</div>
                <div>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(order.shipping_amount)}
                </div>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">Discount</div>
                  <div className="text-red-500">
                    -
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(order.discount_amount)}
                  </div>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <div>Total</div>
                <div>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(order.total_amount)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Update Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={order.status === "pending" ? "default" : "outline"}
                onClick={() => handleUpdateStatus("pending")}
              >
                Pending
              </Button>
              <Button
                variant={order.status === "confirmed" ? "default" : "outline"}
                onClick={() => handleUpdateStatus("confirmed")}
              >
                Confirmed
              </Button>
              <Button
                variant={order.status === "processing" ? "default" : "outline"}
                onClick={() => handleUpdateStatus("processing")}
              >
                Processing
              </Button>
              <Button
                variant={order.status === "shipped" ? "default" : "outline"}
                onClick={() => handleUpdateStatus("shipped")}
              >
                Shipped
              </Button>
              <Button
                variant={order.status === "delivered" ? "default" : "outline"}
                onClick={() => handleUpdateStatus("delivered")}
              >
                Delivered
              </Button>
              <Button
                variant={order.status === "cancelled" ? "destructive" : "outline"}
                onClick={() => handleUpdateStatus("cancelled")}
              >
                Cancelled
              </Button>
              <Button
                variant={order.status === "refunded" ? "destructive" : "outline"}
                onClick={() => handleUpdateStatus("refunded")}
              >
                Refunded
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={order.payment_status === "pending" ? "default" : "outline"}
                onClick={() => handleUpdatePaymentStatus("pending")}
              >
                Pending
              </Button>
              <Button
                variant={order.payment_status === "paid" ? "default" : "outline"}
                onClick={() => handleUpdatePaymentStatus("paid")}
              >
                Paid
              </Button>
              <Button
                variant={order.payment_status === "failed" ? "destructive" : "outline"}
                onClick={() => handleUpdatePaymentStatus("failed")}
              >
                Failed
              </Button>
              <Button
                variant={order.payment_status === "refunded" ? "destructive" : "outline"}
                onClick={() => handleUpdatePaymentStatus("refunded")}
              >
                Refunded
              </Button>
              <Button
                variant={order.payment_status === "partially_refunded" ? "destructive" : "outline"}
                onClick={() => handleUpdatePaymentStatus("partially_refunded")}
              >
                Partially Refunded
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
