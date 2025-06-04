import type { Voucher, VoucherInsert, VoucherUpdate } from "@/types/tables/vouchers"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "vouchers"
const TABLE_NAME = "vouchers"

export const useVoucherQuery = () => {
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

export const useVoucherQueryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLE_NAME).select("*").eq("id", id).single()
      if (error) throw error
      return data
    },
    enabled: !!id && id !== "new",
  })
}

export const useVoucherUpdateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: VoucherUpdate) => {
      const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq("id", payload.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Voucher updated successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to update voucher")
    },
  })
}

export const useVoucherCreateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: VoucherInsert) => {
      const { data, error } = await supabase.from(TABLE_NAME).insert(payload)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Voucher created successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to create voucher")
    },
  })
}

export const useVoucherDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
      if (error) throw error

      const oldData = queryClient
        .getQueryData<Voucher[]>([QUERY_KEY])
        ?.find((voucher) => voucher.id === id)
      return oldData ?? data
    },
    onSuccess: (data: Voucher | null) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      const toastMessage = data ? `Deleted voucher ${data.code}!` : "Voucher deleted successfully"
      toast.success(toastMessage)
    },
    onError: () => {
      toast.error("Failed to delete voucher")
    },
  })
}
