"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { formatDate, formatPrice } from "@/lib/utils"
import type { OrderItem } from "@/types/tables/order_items"
import type { Order } from "@/types/tables/orders"
import { supabase } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { ChevronsUpDownIcon } from "lucide-react"
import Link from "next/link"
import { CreateTicketModal } from "./create-ticket-modal"

interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    product: {
      id: string
      name: string
      images: string[]
      price: number
    } | null
    products: {
      id: string
      name: string
      images: string[]
      price: number
    } | null
    product_variants: {
      id: string
      name: string
      price: number
      product: {
        id: string
        name: string
        images: string[]
        price: number
      }
    } | null
  })[]
}

interface OrdersViewProps {
  orders: OrderWithItems[]
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name,
              images,
              price
            ),
            product_variants (
              id,
              name,
              product:products (
                id,
                name,
                images
              )
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export default function OrdersView({ orders }: OrdersViewProps) {
  if (orders.length === 0) {
    return (
      <div className="pt-28">
        <Card className="flex min-h-[400px] w-full flex-col items-center justify-center text-center">
          <CardHeader className="w-full">
            <CardTitle>No orders found</CardTitle>
            <CardDescription>You haven&apos;t placed any orders yet.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/catalog">Start Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const getPaymentMethodText = (paymentMethod: string) => {
    if (paymentMethod === "cash") return "Cash"
    if (paymentMethod === "bank_transfer") return "Bank Transfer"
    return paymentMethod
  }

  return (
    <Dialog>
      <div className="space-y-8">
        <div>
          <h1 className="font-bold text-3xl">Your Orders</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>

        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="gap-2 p-2">
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <CardHeader className="flex cursor-pointer flex-row items-center gap-2 rounded px-2 py-0.5 hover:bg-muted">
                    <ChevronsUpDownIcon size={16} className="transition-transform duration-300" />
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <CardTitle>Order #{order.id}</CardTitle>
                        <CardDescription>{formatDate(order.created_at)}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          Order Status:{" "}
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "cancelled" || order.status === "refunded"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          Payment Status:{" "}
                          <Badge
                            variant={
                              order.payment_status === "paid"
                                ? "default"
                                : order.payment_status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {order.payment_status.charAt(0).toUpperCase() +
                              order.payment_status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid gap-6 p-2">
                    <div className="flex flex-col gap-2 divide-y">
                      {order.order_items.map((item) => {
                        const productInfo = item.product || item.products

                        const productName = productInfo?.name || "Product Not Available"

                        const productImage = productInfo?.images?.[0] || "/placeholder.png"
                        const variantName = item.product_variants?.name
                        const productPrice = productInfo?.price || 0
                        const variantPrice = item.product_variants?.price || 0
                        const price = productPrice + variantPrice

                        return (
                          <div key={item.id} className="flex items-center gap-4 pb-1">
                            <div className="relative aspect-square h-16 w-16 overflow-hidden rounded-lg">
                              <img
                                src={productImage}
                                alt={productName}
                                className="size-full object-cover"
                              />
                            </div>
                            <div className="flex flex-1 items-center justify-between">
                              <div>
                                <p className="font-medium">{productName}</p>
                                {variantName && (
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm">
                                      Variant: {variantName} (+
                                      {formatPrice(item.product_variants?.price || 0)})
                                    </p>
                                  </div>
                                )}
                                <p className="text-muted-foreground text-sm">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatPrice(price)}</p>
                                <p className="text-muted-foreground text-sm">
                                  Total: {formatPrice(price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex items-center justify-between border-t pt-2">
                      <div>
                        <DialogTrigger asChild>
                          <CreateTicketModal />
                        </DialogTrigger>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-lg">Total:</p>
                        <p className="font-bold text-lg">{formatPrice(order.total_amount)}</p>
                        <Badge
                          className="capitalize"
                          variant={
                            order.payment_method === "cash"
                              ? "default"
                              : order.payment_method === "bank_transfer"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {getPaymentMethodText(order.payment_method)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
