"use server"

import type { Product } from "@/types/tables/products"
import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function getProducts() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data as Product[]
}
