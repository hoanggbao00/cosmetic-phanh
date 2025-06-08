"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function getCatalog() {
  const supabase = await createSupabaseServerClient()

  const { data: categories, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return categories
}
