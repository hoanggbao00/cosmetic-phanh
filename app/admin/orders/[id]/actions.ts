"use server"

import type { OrderUpdate } from "@/types/tables/orders"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateOrderAction(orderId: string, orderData: OrderUpdate) {
  try {
    const supabase = await createSupabaseServerClient()

    // First get the current order
    const { data: currentOrder, error: getError } = await supabase
      .from("orders")
      .select()
      .eq("id", orderId)
      .single()

    if (getError) {
      console.error("Failed to get current order:", getError)
      throw getError
    }

    // Then update with new data
    const { data, error: updateError } = await supabase
      .from("orders")
      .update({ ...currentOrder, ...orderData })
      .eq("id", orderId)
      .select()
      .single()

    if (updateError) {
      console.error("Failed to update order:", updateError)
      throw updateError
    }

    // Revalidate the orders page and the specific order page
    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateOrderAction:", error)
    return { data: null, error }
  }
}
