import type { BlogPost, BlogPostInsert, BlogPostUpdate } from "@/types/tables/blog_posts"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as BlogPost[]
    },
  })
}

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: BlogPostInsert) => {
      const { data, error } = await supabase.from("blog_posts").insert(post).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] })
    },
  })
}

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: BlogPostUpdate) => {
      const { id, ...rest } = post
      const { data, error } = await supabase
        .from("blog_posts")
        .update(rest)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] })
    },
  })
}

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] })
    },
  })
}
