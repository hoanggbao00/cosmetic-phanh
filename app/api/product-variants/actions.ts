"use server"

import type { ProductVariant } from "@/types/tables/product_variants"
import { createSupabaseServerClient } from "@/utils/supabase/server"

export const getVariantDetails = async (variantId: string) => {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("product_variants")
    .select("id, name, price")
    .eq("id", variantId)
    .single()

  if (error) throw error
  return data as ProductVariant
}
