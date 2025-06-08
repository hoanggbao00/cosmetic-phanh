"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function getProducts() {
  const supabase = await createSupabaseServerClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return products
}
