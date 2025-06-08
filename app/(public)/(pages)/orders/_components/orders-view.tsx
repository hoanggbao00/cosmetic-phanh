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
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { formatDate, formatPrice } from "@/lib/utils"
import type { OrderItem } from "@/types/tables/order_items"
import type { Order } from "@/types/tables/orders"
import type { Product } from "@/types/tables/products"
import { supabase } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { CreateTicketModal } from "./create-ticket-modal"

interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    product: Pick<Product, "id" | "name" | "images">
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
        .select("*")
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
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
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
              <CardContent className="grid gap-6">
                <div className="flex flex-col gap-2 divide-y">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-1">
                      <div className="relative aspect-square h-16 w-16 overflow-hidden rounded-lg">
                        <img
                          src={item.product.images?.[0] || "/placeholder.png"}
                          alt={item.product.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
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
            </Card>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
