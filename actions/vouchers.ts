"use server"

import type { Voucher, VoucherInsert, VoucherUpdate } from "@/types/tables/vouchers"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getVouchers() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Voucher[]
}

export async function getVoucherById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("vouchers").select("*").eq("id", id).single()

  if (error) throw error
  return data as Voucher
}

export async function getVoucherByCode(code: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("vouchers").select("*").eq("code", code).single()

  if (error) throw error
  return data as Voucher
}

export async function createVoucher(voucher: VoucherInsert) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("vouchers").insert(voucher).select().single()

  if (error) throw error

  revalidatePath("/admin/vouchers")
  return data as Voucher
}

export async function updateVoucher(id: string, voucher: VoucherUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("vouchers")
    .update(voucher)
    .eq("id", id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath("/admin/vouchers")
  return data as Voucher
}

export async function deleteVoucher(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("vouchers").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/vouchers")
  return true
}

export async function validateVoucher(code: string, userId?: string) {
  const supabase = await createSupabaseServerClient()

  // Get voucher details
  const { data: voucher, error: voucherError } = await supabase
    .from("vouchers")
    .select("*")
    .eq("code", code)
    .single()

  if (voucherError) return { error: voucherError.message }

  // Check if voucher exists
  if (!voucher) {
    return { error: "Invalid voucher code" }
  }

  // Check if voucher is active
  if (!voucher.is_active) {
    return { error: "Voucher is inactive" }
  }

  // Check if voucher has expired
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return { error: "Voucher has expired" }
  }

  // Check if voucher has reached usage limit
  if (voucher.usage_limit && voucher.usage_count >= voucher.usage_limit) {
    return { error: "Voucher usage limit reached" }
  }

  // Check if user has already used this voucher
  if (userId) {
    const { count, error: usageError } = await supabase
      .from("user_voucher_usage")
      .select("*", { count: "exact" })
      .eq("voucher_id", voucher.id)
      .eq("user_id", userId)

    if (usageError) return { error: usageError.message }

    if (count && count > 0) {
      return { error: "You have already used this voucher" }
    }
  }

  return voucher
}
