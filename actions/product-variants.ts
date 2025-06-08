"use server"

import type {
  ProductVariant,
  ProductVariantInsert,
  ProductVariantUpdate,
} from "@/types/tables/product_variants"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProductVariants() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("product_variants").select("*")

  if (error) throw error
  return data as ProductVariant[]
}

export async function getProductVariantsByProductId(productId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)

  if (error) throw error
  return data as ProductVariant[]
}

export async function getProductVariantById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("product_variants").select("*").eq("id", id).single()

  if (error) throw error
  return data as ProductVariant
}

export async function createProductVariant(variant: ProductVariantInsert) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("product_variants").insert(variant).select().single()

  if (error) throw error

  revalidatePath("/admin/products")
  revalidatePath("/shop")
  return data as ProductVariant
}

export async function updateProductVariant(id: string, variant: ProductVariantUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("product_variants")
    .update(variant)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/products")
  revalidatePath("/shop")
  return data as ProductVariant
}

export async function deleteProductVariant(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("product_variants").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/products")
  revalidatePath("/shop")
  return true
}

export async function getVariantDetails(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("product_variants")
    .select(
      `
      *,
      product:products(
        id,
        name,
        images
      )
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as ProductVariant & {
    product: {
      id: string
      name: string
      images: string[]
    }
  }
}
