import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/actions/catalog"
import type { CategoryInsert, CategoryUpdate } from "@/types/tables/categories"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "catalog"

export const useCatalogQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getCategories,
  })
}

export const useCatalogQueryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getCategoryById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category: CategoryInsert) => createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Category created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: CategoryUpdate }) =>
      updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Category updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Category deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
