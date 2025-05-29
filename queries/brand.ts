import type { Brand, BrandInsert, BrandUpdate } from "@/types/tables/brands"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "brands"
const TABLE_NAME = "brands"

export const useBrandQuery = () => {
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

export const useBrandQueryById = (id: string | null) => {
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

export const useBrandUpdateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: BrandUpdate) => {
      const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq("id", payload.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Brand updated successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to update brand")
    },
  })
}
export const useBrandCreateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: BrandInsert) => {
      const { data, error } = await supabase.from(TABLE_NAME).insert(payload)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Brand created successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to create brand")
    },
  })
}

export const useBrandDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
      if (error) throw error

      const oldData = queryClient
        .getQueryData<Brand[]>([QUERY_KEY])
        ?.find((brand) => brand.id === id)
      return oldData ?? data
    },
    onSuccess: (data: Brand | null) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      const toastMessage = data ? `Deleted brand ${data.name}!` : "Brand deleted successfully"
      toast.success(toastMessage)
    },
    onError: () => {
      toast.error("Failed to delete brand")
    },
  })
}
