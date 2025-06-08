import {
  createBlogCategory,
  deleteBlogCategory,
  getBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
} from "@/actions/blog-categories"
import type { BlogCategoryInsert, BlogCategoryUpdate } from "@/types/tables/blog_categories"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "blog-categories"

export const useBlogCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getBlogCategories,
  })
}

export const useBlogCategoryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getBlogCategoryById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category: BlogCategoryInsert) => createBlogCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Blog category created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: BlogCategoryUpdate }) =>
      updateBlogCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Blog category updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Blog category deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
