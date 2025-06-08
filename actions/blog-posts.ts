"use server"

import type { BlogPost, BlogPostInsert, BlogPostUpdate } from "@/types/tables/blog_posts"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

interface GetBlogPostsParams {
  page?: number
  limit?: number
  searchQuery?: string
  categoryId?: string
  isPaginated?: boolean
}

export async function getBlogPosts(params?: GetBlogPostsParams) {
  const supabase = await createSupabaseServerClient()
  const { page = 1, limit = 10, searchQuery = "", categoryId, isPaginated = true } = params || {}
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from("blog_posts")
    .select(
      `
      *,
      category:blog_categories(
        id,
        name
      ),
      author:profiles(
        id,
        full_name,
        avatar_url
      )
    `,
      { count: isPaginated ? "exact" : "planned" }
    )
    .order("created_at", { ascending: false })

  if (isPaginated) {
    query = query.range(from, to)
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error, count } = await query

  if (error) throw error

  if (isPaginated) {
    return {
      data: data as BlogPost[],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    }
  }

  return {
    data: data as BlogPost[],
    total: data.length,
    totalPages: 1,
    currentPage: 1,
  }
}

export async function getBlogPostById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      category:blog_categories(
        id,
        name
      ),
      author:profiles(
        id,
        full_name,
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as BlogPost
}

export async function createBlogPost(post: BlogPostInsert) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("blog_posts").insert(post).select().single()

  if (error) throw error

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return data as BlogPost
}

export async function updateBlogPost(id: string, post: BlogPostUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .update(post)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath(`/blog/${data.slug}`)
  return data as BlogPost
}

export async function deleteBlogPost(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return true
}
