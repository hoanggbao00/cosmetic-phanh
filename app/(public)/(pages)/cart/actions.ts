"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function checkOrderPaymentStatus(orderId: string) {
  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("orders")
      .select("payment_status")
      .eq("id", orderId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Failed to check order payment status:", error)
    throw error
  }
}
