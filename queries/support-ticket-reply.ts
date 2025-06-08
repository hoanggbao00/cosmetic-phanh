import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "support_ticket_replies"
const TABLE_NAME = "support_ticket_replies"

interface ReplyPayload {
  message: string
  is_admin_reply: boolean
}

export const useSupportTicketRepliesQuery = (ticketId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!ticketId,
  })
}

export const useSupportTicketReplyMutation = (ticketId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ReplyPayload) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase.from(TABLE_NAME).insert({
        ticket_id: ticketId,
        message: payload.message,
        user_id: user.id,
        is_admin_reply: payload.is_admin_reply,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, ticketId] })
      queryClient.invalidateQueries({ queryKey: ["support_tickets"] })
      toast.success("Reply sent successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to send reply")
    },
  })
}
