export interface SupportTicketReply {
  id: string
  ticket_id: string
  user_id: string | null
  message: string
  is_admin_reply: boolean
  attachments: string[] | null
  created_at: string
}
export interface SupportTicketReplyInsert {
  id?: string
  ticket_id: string
  user_id?: string | null
  message: string
  is_admin_reply?: boolean
  attachments?: string[] | null
  created_at?: string
}
export interface SupportTicketReplyUpdate {
  id?: string
  ticket_id?: string
  user_id?: string | null
  message?: string
  is_admin_reply?: boolean
  attachments?: string[] | null
  created_at?: string
}
