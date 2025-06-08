"use server"

import type {
  BlogCategory,
  BlogCategoryInsert,
  BlogCategoryUpdate,
} from "@/types/tables/blog_categories"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getBlogCategories() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as BlogCategory[]
}

export async function getBlogCategoryById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("blog_categories").select("*").eq("id", id).single()

  if (error) throw error
  return data as BlogCategory
}

export async function createBlogCategory(category: BlogCategoryInsert) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("blog_categories").insert(category).select().single()

  if (error) throw error

  revalidatePath("/admin/blog/categories")
  revalidatePath("/blog")
  return data as BlogCategory
}

export async function updateBlogCategory(id: string, category: BlogCategoryUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_categories")
    .update(category)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/blog/categories")
  revalidatePath("/blog")
  return data as BlogCategory
}

export async function deleteBlogCategory(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("blog_categories").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/blog/categories")
  revalidatePath("/blog")
  return true
}
