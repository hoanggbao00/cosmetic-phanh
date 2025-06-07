"use client"

import { updateOrderAction } from "@/app/admin/orders/[id]/actions"
import type { Order, OrderUpdate } from "@/types/tables/orders"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Order deleted successfully")
    },
    onError: (error) => {
      console.error("Failed to delete order:", error)
      toast.error("Failed to delete order")
    },
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...order }: OrderUpdate & { id: string }) => {
      const { data, error } = await updateOrderAction(id, order)

      if (error) {
        throw error
      }

      return data as Order
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["orders", data.id] })
      toast.success("Order updated successfully")
    },
    onError: (error) => {
      console.error("Failed to update order:", error)
      toast.error("Failed to update order")
    },
  })
}
