"use server"

import type { ProductVariant } from "@/types/tables/product_variants"
import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function getProductVariantsByProduct(productId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)

  if (error) {
    throw error
  }

  return data as ProductVariant[]
}
