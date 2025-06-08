import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  getBlogPosts,
  updateBlogPost,
} from "@/actions/blog-posts"
import type { BlogPostInsert, BlogPostUpdate } from "@/types/tables/blog_posts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "blog-posts"

interface BlogPostsParams {
  page?: number
  limit?: number
  searchQuery?: string
  categoryId?: string
  isPaginated?: boolean
}

export const useBlogPosts = (params?: BlogPostsParams) => {
  const { page = 1, limit = 10, searchQuery = "", categoryId, isPaginated = true } = params || {}

  return useQuery({
    queryKey: [QUERY_KEY, { page, limit, searchQuery, categoryId, isPaginated }],
    queryFn: () => getBlogPosts({ page, limit, searchQuery, categoryId, isPaginated }),
  })
}

export const useBlogPostById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getBlogPostById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: BlogPostInsert) => createBlogPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Blog post created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: BlogPostUpdate }) => updateBlogPost(id, post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Blog post updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Blog post deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
