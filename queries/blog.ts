import type { Tables } from "@/types/supabase"
import { supabase } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

export const BLOG_KEYS = {
  all: ["blog"] as const,
  posts: () => [...BLOG_KEYS.all, "posts"] as const,
  latest: () => [...BLOG_KEYS.posts(), "latest"] as const,
  relatedPosts: (category: string) => [...BLOG_KEYS.posts(), "related", category] as const,
}

export const useLatestBlogPosts = () => {
  return useQuery({
    queryKey: BLOG_KEYS.latest(),
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select(`
          *
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) throw error

      return posts
    },
  })
}

export const useRelatedBlogPosts = (category: string) => {
  return useQuery({
    queryKey: BLOG_KEYS.relatedPosts(category),
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories(
            id,
            name
          )
        `)
        .eq("status", "published")
        .eq("blog_categories.name", category)
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) throw error

      return posts.map((post) => ({
        ...post,
        categories: post.blog_categories.map((c: Tables<"blog_categories">) => c.name),
      }))
    },
  })
}
