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

export const useValidateVoucher = (onSuccess: (discount: number) => void) => {
  return useMutation({
    mutationFn: async ({
      code,
      subtotal,
    }: {
      code: string
      subtotal: number
    }): Promise<{ voucherId: string; discount: number }> => {
      const now = new Date().toISOString()

      // First check if voucher exists and is valid
      const { data: vouchers, error: searchError } = await supabase
        .from(TABLE_NAME)
        .select("*, used_count")
        .ilike("code", code)
        .eq("is_active", true)
        .lte("starts_at", now)
        .or(`expires_at.is.null,expires_at.gt.${now}`)

      if (searchError) {
        console.error("Voucher search error:", searchError)
        throw new Error("Failed to validate voucher")
      }

      if (!vouchers || vouchers.length === 0) {
        throw new Error("Invalid voucher code or voucher has expired")
      }

      const data = vouchers[0]

      // Check usage limit
      if (data.usage_limit && data.used_count >= data.usage_limit) {
        throw new Error("This voucher has reached its usage limit")
      }

      // Check minimum order amount
      if (data.minimum_order_amount && subtotal < data.minimum_order_amount) {
        throw new Error(
          `Minimum order amount for this voucher is $${data.minimum_order_amount.toFixed(2)}`
        )
      }

      // Calculate discount
      let discount = 0
      if (data.type === "percentage") {
        discount = (subtotal * data.value) / 100
      } else {
        discount = data.value
      }

      // Apply maximum discount if set
      if (data.maximum_discount_amount && discount > data.maximum_discount_amount) {
        discount = data.maximum_discount_amount
      }

      return {
        voucherId: data.id,
        discount,
      }
    },
    onSuccess: (data) => {
      onSuccess(data.discount)
    },
  })
}
