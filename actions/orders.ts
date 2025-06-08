"use server"

import type { Profiles } from "@/types/tables"
import type { Order, OrderInsert, OrderUpdate } from "@/types/tables/orders"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

interface GetOrdersParams {
  page?: number
  limit?: number
  searchQuery?: string
  status?: string
  isPaginated?: boolean
}

export async function getOrders(params?: GetOrdersParams) {
  const supabase = await createSupabaseServerClient()
  const { page = 1, limit = 10, searchQuery = "", status, isPaginated = true } = params || {}
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      user:profiles(
        id,
        full_name,
        email
      ),
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
    `,
      { count: isPaginated ? "exact" : "planned" }
    )
    .order("created_at", { ascending: false })

  if (isPaginated) {
    query = query.range(from, to)
  }

  if (searchQuery) {
    query = query.or(`id.ilike.%${searchQuery}%,user.full_name.ilike.%${searchQuery}%`)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error, count } = await query

  if (error) throw error

  if (isPaginated) {
    return {
      data: data as Order[],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    }
  }

  return {
    data: data as (Order & { profiles: Profiles })[],
    total: data.length,
    totalPages: 1,
    currentPage: 1,
  }
}

export async function getOrderById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      user:profiles(
        id,
        full_name,
        email
      ),
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
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Order
}

export async function createOrder(order: OrderInsert) {
  const supabase = await createSupabaseServerClient()

  // Extract order items before creating order
  const { order_items: orderItems = [], ...orderData } = order

  // Start a Supabase transaction
  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single()

  if (orderError) throw orderError

  // Insert order items if there are any
  if (orderItems.length > 0) {
    const orderItemsWithId = orderItems.map((item) => ({
      ...item,
      order_id: newOrder.id,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsWithId)

    if (itemsError) {
      // If inserting items fails, delete the order to maintain consistency
      await supabase.from("orders").delete().eq("id", newOrder.id)
      throw itemsError
    }
  }

  revalidatePath("/admin/orders")
  revalidatePath("/orders")
  return newOrder as Order
}

export async function updateOrder(id: string, order: OrderUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("orders").update(order).eq("id", id).select().single()

  if (error) throw error

  revalidatePath("/admin/orders")
  revalidatePath("/orders")
  return data as Order
}

export async function deleteOrder(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("orders").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/orders")
  revalidatePath("/orders")
  return true
}

export async function getOrdersByUser(userId: string) {
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
  return data as Order[]
}

export async function getOrdersByIds(orderIds: string[]) {
  // Return empty array if no valid IDs
  if (!orderIds?.length) return []

  // Filter out any empty strings or invalid IDs
  const validOrderIds = orderIds.filter((id) => !!id && id.trim() !== "")
  if (!validOrderIds.length) return []

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          images,
          price
        ),
        product_variants (
          id,
          name,
          price,
          product:products (
            id,
            name,
            images,
            price
          )
        )
      )
    `)
    .in("id", validOrderIds)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}
