import PageLayout from "@/components/layout/(public)/page-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import TicketsView from "./_components/tickets-view"

export default async function TicketsPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select(`
      *,
      replies:support_ticket_replies(
        id,
        message,
        created_at,
        user:profiles(
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 pt-28 md:px-0">
      <TicketsView tickets={tickets || []} />
    </PageLayout>
  )
}
