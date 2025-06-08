"use server"

import type { BlogPost } from "@/types/tables/blog_posts"
import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function getFeaturedBlogPosts() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:profiles(name, avatar_url),
      category:blog_categories(name)
    `)
    .eq("is_featured", true)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (error) throw error
  return data as (BlogPost & {
    author: {
      name: string
      avatar_url: string
    }
    category: {
      name: string
    }
  })[]
}
