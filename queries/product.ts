import type { Product, ProductInsert, ProductUpdate } from "@/types/tables/products"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "products"
const TABLE_NAME = "products"

export const useProductQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export const useProductQueryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from(TABLE_NAME).select("*").eq("id", id).single()
      if (error) throw error
      return data
    },
    enabled: !!id && id !== "new",
  })
}

export const useProductUpdateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProductUpdate) => {
      const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq("id", payload.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Product updated successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to update product")
    },
  })
}
export const useProductCreateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProductInsert) => {
      const { data, error } = await supabase.from(TABLE_NAME).insert(payload)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Product created successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to create product")
    },
  })
}

export const useProductDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
      if (error) throw error

      const oldData = queryClient
        .getQueryData<Product[]>([QUERY_KEY])
        ?.find((product) => product.id === id)
      return oldData ?? data
    },
    onSuccess: (data: Product | null) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      const toastMessage = data ? `Deleted product ${data.name}!` : "Product deleted successfully"
      toast.success(toastMessage)
    },
    onError: () => {
      toast.error("Failed to delete product")
    },
  })
}
