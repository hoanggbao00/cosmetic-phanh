import PageLayout from "@/components/layout/(public)/page-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import FailView from "./_components/fail-view"

export default async function BankingFailPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const ordersLink = session ? "/orders" : "/orders/local"

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 md:px-0">
      <FailView ordersLink={ordersLink} />
    </PageLayout>
  )
}
