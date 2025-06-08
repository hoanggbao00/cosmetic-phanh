"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createReview({
  productId,
  userId,
  rating,
  comment,
}: {
  productId: string
  userId: string
  rating: number
  comment: string
}) {
  try {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
    })

    if (error) throw error

    revalidatePath("/product/[slug]")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to create review" }
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.from("product_reviews").delete().eq("id", reviewId)

    if (error) throw error

    revalidatePath("/product/[slug]")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to delete review" }
  }
}

export async function replyToReview({
  reviewId,
  reply,
}: {
  reviewId: string
  reply: string
}) {
  try {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
      .from("product_reviews")
      .update({ admin_reply: reply })
      .eq("id", reviewId)

    if (error) throw error

    revalidatePath("/product/[slug]")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to reply to review" }
  }
}

export async function checkUserCanReview(userId: string, productId: string) {
  try {
    const supabase = await createSupabaseServerClient()

    // First check if user has any orders
    const { data: orders } = await supabase.from("orders").select("id").eq("user_id", userId)

    if (!orders || orders.length === 0) {
      return {
        canReview: false,
        hasReviewed: false,
        message: "You need to purchase this product first",
      }
    }

    // Then check if any of those orders contain the product
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("id")
      .in(
        "order_id",
        orders.map((order) => order.id)
      )
      .eq("product_id", productId)
      .single()

    // Check if user has already reviewed
    const { data: existingReview } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single()

    return {
      canReview: !!orderItems && !existingReview,
      hasReviewed: !!existingReview,
      message: existingReview
        ? "You have already reviewed this product"
        : orderItems
          ? "You can review this product"
          : "You need to purchase this product first",
    }
  } catch (error) {
    console.error(error)
    return {
      error: "Failed to check review status",
      canReview: false,
      hasReviewed: false,
    }
  }
}
