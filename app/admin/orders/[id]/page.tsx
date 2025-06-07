import PrivateLayout from "@/components/layout/private/private-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import { notFound } from "next/navigation"
import OrderDetail from "./_components/order-detail"

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  noStore()
  const supabase = await createSupabaseServerClient()
  const { id } = await params

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        product:products (
          id,
          name,
          images
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error || !order) {
    console.error("Error fetching order:", error)
    notFound()
  }

  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Orders", href: "/admin/orders" }}
      currentBreadcrumb={`Order #${order.order_number}`}
      title={`Order #${order.order_number}`}
    >
      <OrderDetail order={order} key={order.updated_at} />
    </PrivateLayout>
  )
}
