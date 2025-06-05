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
import { formatDate, formatPrice } from "@/lib/utils"
import type { Tables } from "@/types/supabase"
import type { Product } from "@/types/tables"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

interface OrdersViewProps {
  orders: (Tables<"orders"> & {
    order_items: (Tables<"order_items"> & {
      product: Pick<Product, "id" | "name" | "images">
    })[]
    order_status_history: Tables<"order_status_history">[]
  })[]
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl">Your Orders</h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const latestStatus = order.order_status_history.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>{formatDate(order.created_at)}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      latestStatus?.status === "delivered"
                        ? "default"
                        : latestStatus?.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {latestStatus?.status || "processing"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex flex-col gap-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative aspect-square h-16 w-16 overflow-hidden rounded-lg">
                        <img
                          src={item.product.images[0] || "/placeholder.png"}
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
                <div className="flex items-center justify-between border-t pt-4">
                  <p className="font-medium text-lg">Total</p>
                  <p className="font-bold text-lg">{formatPrice(order.total_amount)}</p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="outline" asChild>
                  <Link href={`/orders/${order.id}`}>
                    View Details
                    <ChevronRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
