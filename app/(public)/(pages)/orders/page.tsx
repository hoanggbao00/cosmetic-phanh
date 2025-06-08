import PageLayout from "@/components/layout/(public)/page-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import OrdersView from "./_components/orders-view"

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        product:products(
          id,
          name,
          images
        )
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 pt-28 md:px-0">
      <OrdersView orders={orders || []} />
    </PageLayout>
  )
}
