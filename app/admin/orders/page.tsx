import PrivateLayout from "@/components/layout/private/private-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import OrdersTable from "./orders-table"

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles:user_id (
        full_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return <div>Error loading orders: {error.message}</div>
  }

  // Transform the data to include user_name
  const ordersWithUserNames = orders.map((order) => ({
    ...order,
    user_name: order.profiles?.full_name || "",
  }))

  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Orders", href: "/admin/orders" }}
      currentBreadcrumb="Orders"
      title="Orders"
    >
      <OrdersTable initialOrders={ordersWithUserNames} />
    </PrivateLayout>
  )
}
