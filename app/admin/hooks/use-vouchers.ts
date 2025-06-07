import type { Voucher } from "@/types/tables/vouchers"
import { supabase } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

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

export const calculateVoucherDiscount = (voucher: Voucher | null, subtotal: number): number => {
  if (!voucher) return 0

  let discount = 0
  if (voucher.type === "percentage") {
    discount = (subtotal * voucher.value) / 100
  } else {
    discount = voucher.value
  }

  // Apply minimum order amount check
  if (voucher.minimum_order_amount && subtotal < voucher.minimum_order_amount) {
    return 0
  }

  // Apply maximum discount amount check
  if (voucher.maximum_discount_amount) {
    discount = Math.min(discount, voucher.maximum_discount_amount)
  }

  return discount
}
