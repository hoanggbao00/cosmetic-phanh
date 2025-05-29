export interface NotificationLog {
  id: string
  user_id: string | null
  email: string | null
  type: string
  subject: string | null
  content: string | null
  status: "pending" | "sent" | "failed"
  sent_at: string | null
  error_message: string | null
  created_at: string
}
export interface NotificationLogInsert {
  id?: string
  user_id?: string | null
  email?: string | null
  type: string
  subject?: string | null
  content?: string | null
  status?: "pending" | "sent" | "failed"
  sent_at?: string | null
  error_message?: string | null
  created_at?: string
}
export interface NotificationLogUpdate {
  id?: string
  user_id?: string | null
  email?: string | null
  type?: string
  subject?: string | null
  content?: string | null
  status?: "pending" | "sent" | "failed"
  sent_at?: string | null
  error_message?: string | null
  created_at?: string
}
