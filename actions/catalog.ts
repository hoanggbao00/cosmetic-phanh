"use server"

import type { Category, CategoryInsert, CategoryUpdate } from "@/types/tables/categories"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getCategories() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Category[]
}

export async function getCategoryById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

  if (error) throw error
  return data as Category
}

export async function createCategory(category: CategoryInsert) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("categories").insert(category).select().single()

  if (error) throw error

  revalidatePath("/admin/catalog")
  revalidatePath("/shop")
  return data as Category
}

export async function updateCategory(id: string, category: CategoryUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/catalog")
  revalidatePath("/shop")
  return data as Category
}

export async function deleteCategory(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/catalog")
  revalidatePath("/shop")
  return true
}
