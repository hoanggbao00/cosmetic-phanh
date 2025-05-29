import type { Image, ImageInsert, ImageUpdate } from "@/types/tables/images"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "images"
const TABLE_NAME = "images"

export const useImageQuery = ({ enabled }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as Image[]
    },
    enabled,
  })
}

export const useImageQueryById = (id: string | null) => {
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

export const useImageUpdateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ImageUpdate) => {
      const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq("id", payload.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Image updated successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to update image")
    },
  })
}
export const useImageCreateMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ImageInsert) => {
      const { data, error } = await supabase.from(TABLE_NAME).insert(payload)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Image created successfully")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Failed to create image")
    },
  })
}

export const useImageDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
      if (error) throw error

      const oldData = queryClient
        .getQueryData<Image[]>([QUERY_KEY])
        ?.find((image) => image.id === id)
      return oldData ?? data
    },
    onSuccess: (data: Image | null) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      const toastMessage = data ? `Deleted image ${data.id}!` : "Image deleted successfully"
      toast.success(toastMessage)
    },
    onError: () => {
      toast.error("Failed to delete image")
    },
  })
}
