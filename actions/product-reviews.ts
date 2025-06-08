"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function getProductReviews() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("product_reviews")
    .select(`
      *,
      products (
        id,
        name,
        images
      ),
      reviewer:profiles!product_reviews_user_id_fkey (
        id,
        full_name,
        avatar_url
      ),
      admin:profiles!product_reviews_admin_reply_by_fkey (
        id,
        full_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function updateProductReview(id: string, adminReply: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("product_reviews")
    .update({
      admin_reply: adminReply,
      admin_reply_at: new Date().toISOString(),
      admin_reply_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProductReview(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("product_reviews").delete().eq("id", id)

  if (error) throw error
  return true
}
