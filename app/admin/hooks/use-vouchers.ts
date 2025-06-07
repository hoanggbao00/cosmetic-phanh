import type { Voucher } from "@/types/tables/vouchers"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useVouchers = () => {
  return useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .eq("is_active", true)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Voucher[]
    },
  })
}

export const useUpdateVoucherUsage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (voucherId: string) => {
      const { error } = await supabase.rpc("increment_voucher_usage", {
        voucher_id: voucherId,
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] })
    },
  })
}

export const calculateVoucherDiscount = (
  voucher: Voucher | null,
  subtotal: number
): { discount: number; error?: string } => {
  if (!voucher) return { discount: 0 }

  // Check if voucher has reached usage limit
  if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
    return { discount: 0, error: "Voucher has reached its usage limit" }
  }

  let discount = 0
  if (voucher.type === "percentage") {
    discount = (subtotal * voucher.value) / 100
  } else {
    discount = voucher.value
  }

  // Apply minimum order amount check
  if (voucher.minimum_order_amount && subtotal < voucher.minimum_order_amount) {
    return {
      discount: 0,
      error: `Minimum order amount required: ${voucher.minimum_order_amount.toLocaleString()} ₫`,
    }
  }

  // Apply maximum discount amount check
  if (voucher.maximum_discount_amount) {
    discount = Math.min(discount, voucher.maximum_discount_amount)
  }

  return { discount }
}
