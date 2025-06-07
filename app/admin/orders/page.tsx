import PrivateLayout from "@/components/layout/private/private-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import OrdersTable from "./orders-table"

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return <div>Error loading orders: {error.message}</div>
  }

  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Orders", href: "/admin/orders" }}
      currentBreadcrumb="Orders"
      title="Orders"
    >
      <OrdersTable initialOrders={orders} />
    </PrivateLayout>
  )
}
