"use server"

import type { Product, ProductInsert, ProductUpdate } from "@/types/tables/products"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProducts() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function getFeaturedProducts(limit = 3) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

export async function getProductById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) throw error
  return data as Product
}

export async function createProduct(product: ProductInsert) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) throw error

  revalidatePath("/admin/products")
  return data as Product
}

export async function updateProduct(id: string, product: ProductUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/products")
  return data as Product
}

export async function deleteProduct(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/products")
  return true
}
