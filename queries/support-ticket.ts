import type { SupportTicket, SupportTicketUpdate } from "@/types/tables/support_tickets"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "support_tickets"
const TABLE_NAME = "support_tickets"

export const useSupportTicketQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export const useSupportTicketQueryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLE_NAME).select("*").eq("id", id).single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export const useSupportTicketUpdateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SupportTicketUpdate) => {
      const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq("id", payload.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Support ticket updated successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to update support ticket")
    },
  })
}

export const useSupportTicketDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
      if (error) throw error

      const oldData = queryClient
        .getQueryData<SupportTicket[]>([QUERY_KEY])
        ?.find((ticket) => ticket.id === id)
      return oldData ?? data
    },
    onSuccess: (data: SupportTicket | null) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      const toastMessage = data
        ? `Deleted ticket #${data.ticket_number}!`
        : "Support ticket deleted successfully"
      toast.success(toastMessage)
    },
    onError: () => {
      toast.error("Failed to delete support ticket")
    },
  })
}
