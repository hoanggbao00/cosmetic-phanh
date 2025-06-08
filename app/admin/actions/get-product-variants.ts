"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function getProductVariants(productId: string) {
  if (!productId) return []

  const supabase = await createSupabaseServerClient()

  const { data: variants, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("name")

  if (error) {
    console.error("Error fetching product variants:", error)
    return []
  }

  return variants
}
