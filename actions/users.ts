"use server"

import type { Profiles, ProfilesUpdate } from "@/types/tables"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Profiles[]
}

export async function getUserById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error) throw error
  return data as Profiles
}

export async function updateUser(id: string, profile: ProfilesUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/users")
  revalidatePath("/profile")
  return data as Profiles
}

export async function deleteUser(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("profiles").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/users")
  return true
}

export async function getUserAddresses(userId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })

  if (error) throw error
  return data
}

export async function getUserVouchers(userId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("user_voucher_usage")
    .select(
      `
      *,
      voucher:vouchers(
        id,
        code,
        type,
        value,
        minimum_order_amount,
        maximum_discount_amount,
        expires_at
      )
    `
    )
    .eq("user_id", userId)

  if (error) throw error
  return data
}

export async function getUserOrders(userId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items(
        id,
        quantity,
        price,
        product_variant:product_variants(
          id,
          name,
          product:products(
            id,
            name,
            images
          )
        )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
