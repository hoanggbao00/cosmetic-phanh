export interface SupportTicketReply {
  id: string
  ticket_id: string
  user_id: string
  message: string
  created_at: string
  user?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

export interface SupportTicket {
  id: string
  user_id: string | null
  guest_email: string | null
  ticket_number: string
  subject: string
  message: string
  status: "open" | "closed"
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
  replies?: SupportTicketReply[]
}

export type SupportTicketInsert = Omit<SupportTicket, "id" | "created_at" | "updated_at">

export type SupportTicketUpdate = Partial<SupportTicket>
