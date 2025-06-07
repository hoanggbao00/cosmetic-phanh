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

export const useValidateVoucher = (onSuccess?: (discount: number) => void) => {
  return useMutation({
    mutationFn: async ({ code, subtotal }: { code: string; subtotal: number }) => {
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .single()

      if (error) throw new Error("Invalid voucher code")

      const voucher = data
      const now = new Date()
      const startsAt = new Date(voucher.starts_at)
      const expiresAt = voucher.expires_at ? new Date(voucher.expires_at) : null

      // Check if voucher is within valid date range
      if (now < startsAt || (expiresAt && now > expiresAt)) {
        throw new Error("Voucher has expired or not yet active")
      }

      // Check usage limit
      if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
        throw new Error("Voucher usage limit exceeded")
      }

      // Check minimum order amount
      if (voucher.minimum_order_amount && subtotal < voucher.minimum_order_amount) {
        throw new Error(`Minimum order amount is $${voucher.minimum_order_amount}`)
      }

      // Calculate discount
      let discount = 0
      if (voucher.type === "percentage") {
        discount = (subtotal * voucher.value) / 100
      } else {
        discount = voucher.value
      }

      // Apply maximum discount if set
      if (voucher.maximum_discount_amount && discount > voucher.maximum_discount_amount) {
        discount = voucher.maximum_discount_amount
      }

      const result = {
        voucherId: voucher.id,
        discount: discount,
      }
      return result
    },
    onSuccess: (data) => {
      onSuccess?.(data.discount)
    },
    onError: (error) => {
      console.error("Mutation error:", error)
    },
  })
}
