"use client"

import PageLayout from "@/components/layout/(public)/page-layout"
import { useOrderStore } from "@/stores/order-store"
import OrdersView from "../_components/orders-view"

export default function LocalOrdersPage() {
  const orderHistory = useOrderStore((state) => state.orderHistory)

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 pt-28 md:px-0">
      <OrdersView
        orders={orderHistory.map((order) => ({
          id: order.orderId,
          status: order.status,
          payment_status: order.paymentStatus,
          total_amount: order.total,
          created_at: order.createdAt,
          order_items: order.items.map((item) => ({
            id: item.productId,
            product: {
              id: item.productId,
              name: item.name,
              images: [],
            },
            quantity: item.quantity,
            price: item.price,
            variant: item.variantId
              ? {
                  id: item.variantId,
                  name: item.variantName,
                }
              : null,
          })),
        }))}
      />
    </PageLayout>
  )
}
