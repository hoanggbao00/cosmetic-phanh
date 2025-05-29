export interface SupportTicket {
  id: string
  ticket_number: string
  user_id: string | null
  guest_email: string | null
  subject: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "resolved" | "closed"
  assigned_to: string | null
  created_at: string
  updated_at: string
}
export interface SupportTicketInsert {
  id?: string
  ticket_number?: string
  user_id?: string | null
  guest_email?: string | null
  subject: string
  message: string
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "open" | "in_progress" | "resolved" | "closed"
  assigned_to?: string | null
  created_at?: string
  updated_at?: string
}
export interface SupportTicketUpdate {
  id?: string
  ticket_number?: string
  user_id?: string | null
  guest_email?: string | null
  subject?: string
  message?: string
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "open" | "in_progress" | "resolved" | "closed"
  assigned_to?: string | null
  created_at?: string
  updated_at?: string
}
