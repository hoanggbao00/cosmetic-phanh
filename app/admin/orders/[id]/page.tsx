import PrivateLayout from "@/components/layout/private/private-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import OrderForm from "../_components/order-form"

interface Props {
  params: {
    id: string
  }
}

export default async function EditOrderPage({ params }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*),
      order_status_history (*)
    `)
    .eq("id", params.id)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Orders", href: "/admin/orders" }}
      currentBreadcrumb="Edit Order"
      title="Edit Order"
      className="mx-auto w-full max-w-7xl"
    >
      <OrderForm order={order} />
    </PrivateLayout>
  )
}
