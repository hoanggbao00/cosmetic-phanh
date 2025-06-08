"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function getVariants() {
  const supabase = await createSupabaseServerClient()

  const { data: variants, error } = await supabase
    .from("product_variants")
    .select("*")
    .order("name")

  if (error) {
    console.error("Error fetching variants:", error)
    return []
  }

  return variants
}
