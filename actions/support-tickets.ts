"use server"

import type {
  SupportTicket,
  SupportTicketInsert,
  SupportTicketUpdate,
} from "@/types/tables/support_tickets"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export async function getSupportTickets() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("support_tickets")
    .select(
      `
      *,
      user:profiles(
        id,
        full_name,
        email
      ),
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
    `
    )
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as SupportTicket[]
}

export async function getSupportTicketById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("support_tickets")
    .select(
      `
      *,
      user:profiles(
        id,
        full_name,
        email
      ),
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
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as SupportTicket
}

export async function getSupportTicketsByUser(userId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("support_tickets")
    .select(
      `
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
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as SupportTicket[]
}

type CreateTicketInput = {
  subject: string
  message: string
  priority: "low" | "medium" | "high"
}

export async function createSupportTicket(data: CreateTicketInput) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User must be logged in to create a ticket")
  }

  const ticket: SupportTicketInsert = {
    ...data,
    ticket_number: `TKT-${nanoid(8)}`,
    user_id: user.id,
    guest_email: null,
    status: "open",
  }

  const { data: newTicket, error } = await supabase
    .from("support_tickets")
    .insert(ticket)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/tickets")
  return newTicket as SupportTicket
}

export async function updateSupportTicket(id: string, ticket: SupportTicketUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("support_tickets")
    .update(ticket)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/support")
  revalidatePath("/support")
  return data as SupportTicket
}

export async function deleteSupportTicket(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("support_tickets").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/support")
  revalidatePath("/support")
  return true
}
