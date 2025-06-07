import type { Order } from "@/types/tables/orders"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Order> & { id: string }) => {
      const { data: updatedOrder, error } = await supabase
        .from("orders")
        .update(data)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return updatedOrder
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
