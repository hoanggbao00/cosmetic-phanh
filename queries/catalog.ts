import type { Category, CategoryInsert, CategoryUpdate } from "@/types/tables/categories"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "catalog"

export const useCatalogQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export const useCatalogQueryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export const useCatalogUpdateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CategoryUpdate) => {
      const { data, error } = await supabase.from("categories").update(payload).eq("id", payload.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Catalog updated successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to update catalog")
    },
  })
}
export const useCatalogCreateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CategoryInsert) => {
      const { data, error } = await supabase.from("categories").insert(payload)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Catalog created successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to create catalog")
    },
  })
}

export const useCatalogDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error

      const oldData = queryClient
        .getQueryData<Category[]>([QUERY_KEY])
        ?.find((category) => category.id === id)
      return oldData ?? data
    },
    onSuccess: (data: Category | null) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      const toastMessage = data ? `Deleted catalog ${data.name}!` : "Catalog deleted successfully"
      toast.success(toastMessage)
    },
    onError: () => {
      toast.error("Failed to delete catalog")
    },
  })
}
