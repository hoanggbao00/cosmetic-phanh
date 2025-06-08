"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTicketReply(ticketId: string, message: string) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User must be logged in to reply to tickets")
  }

  const { error } = await supabase.from("support_ticket_replies").insert({
    ticket_id: ticketId,
    user_id: user.id,
    message,
  })

  if (error) throw error

  revalidatePath("/tickets")
  return true
}
