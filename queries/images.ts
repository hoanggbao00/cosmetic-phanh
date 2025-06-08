import {
  createImage,
  deleteImage,
  deleteImageFromStorage,
  getImageById,
  getImages,
  updateImage,
  uploadImage,
} from "@/actions/images"
import type { ImageInsert, ImageUpdate } from "@/types/tables/images"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "images"

export const useImages = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getImages,
  })
}

export const useImageById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getImageById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useCreateImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (image: ImageInsert) => createImage(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Image created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: ImageUpdate }) => updateImage(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Image updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const image = await getImageById(id)
      if (image.url) {
        await deleteImageFromStorage(image.url)
      }
      await deleteImage(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Image deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUploadImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Image uploaded successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
