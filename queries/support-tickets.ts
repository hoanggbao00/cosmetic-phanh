import {
  createSupportTicket,
  deleteSupportTicket,
  getSupportTicketById,
  getSupportTickets,
  getSupportTicketsByUser,
  updateSupportTicket,
} from "@/actions/support-tickets"
import type { SupportTicketInsert, SupportTicketUpdate } from "@/types/tables/support_tickets"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "support-tickets"

export const useSupportTickets = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getSupportTickets,
  })
}

export const useSupportTicketById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getSupportTicketById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useSupportTicketsByUser = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, "user", userId],
    queryFn: () => getSupportTicketsByUser(userId!),
    enabled: !!userId,
  })
}

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Omit<SupportTicketInsert, "id" | "ticket_number" | "created_at" | "updated_at">
    ) => createSupportTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] })
      toast.success("Support ticket created successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create support ticket")
    },
  })
}

export const useUpdateSupportTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ticket }: { id: string; ticket: SupportTicketUpdate }) =>
      updateSupportTicket(id, ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Support ticket updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteSupportTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Support ticket deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
