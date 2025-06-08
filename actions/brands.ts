"use server"

import type { Brand, BrandInsert, BrandUpdate } from "@/types/tables/brands"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getBrands() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Brand[]
}

export async function getBrandById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("brands").select("*").eq("id", id).single()

  if (error) throw error
  return data as Brand
}

export async function createBrand(brand: BrandInsert) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("brands").insert(brand).select().single()

  if (error) throw error

  revalidatePath("/admin/brands")
  return data as Brand
}

export async function updateBrand(id: string, brand: BrandUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("brands").update(brand).eq("id", id).select().single()

  if (error) throw error

  revalidatePath("/admin/brands")
  return data as Brand
}

export async function deleteBrand(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("brands").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/brands")
  return true
}
