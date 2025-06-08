"use client"

import PageLayout from "@/components/layout/(public)/page-layout"
import { useOrdersByIds } from "@/queries/orders"
import { useOrderStore } from "@/stores/order-store"
import { Loader2Icon } from "lucide-react"
import OrdersView from "../_components/orders-view"

export default function LocalOrdersPage() {
  const orderHistory = useOrderStore((state) => state.orderHistory)
  const {
    data: orders,
    isLoading,
    isError,
  } = useOrdersByIds(orderHistory.map((order) => order.orderId))

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 pt-28 md:px-0">
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading orders...</span>
        </div>
      ) : isError ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-muted-foreground">
            Failed to load orders. Please try again later.
          </div>
        </div>
      ) : (
        <OrdersView orders={orders || []} />
      )}
    </PageLayout>
  )
}
