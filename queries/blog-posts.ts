import type { BlogPost, BlogPostInsert, BlogPostUpdate } from "@/types/tables/blog_posts"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface BlogPostsParams {
  page?: number
  limit?: number
  searchQuery?: string
  categoryId?: string
  isPaginated?: boolean
}

export const useBlogPosts = (params?: BlogPostsParams) => {
  const { page = 1, limit = 10, searchQuery = "", categoryId, isPaginated = true } = params || {}
  const from = (page - 1) * limit
  const to = from + limit - 1

  return useQuery({
    queryKey: ["blog-posts", { page, limit, searchQuery, categoryId, isPaginated }],
    queryFn: async () => {
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
