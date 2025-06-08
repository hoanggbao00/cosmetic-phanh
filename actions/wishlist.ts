"use server"

import type { WishlistItem } from "@/types/tables/wishlist_items"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getWishlistItems(userId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("wishlist_items")
    .select(
      `
      *,
      product:products(
        id,
        name,
        price,
        images
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as WishlistItem[]
}

export async function addToWishlist(userId: string, productId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("wishlist_items")
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/wishlist")
  return data as WishlistItem
}

export async function removeFromWishlist(userId: string, productId: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId)

  if (error) throw error

  revalidatePath("/wishlist")
  return true
}

export async function isInWishlist(userId: string, productId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single()

  if (error) {
    if (error.code === "PGRST116") return false // Not found
    throw error
  }

  return !!data
}
