import { createBrand, deleteBrand, getBrandById, getBrands, updateBrand } from "@/actions/brands"
import type { BrandInsert, BrandUpdate } from "@/types/tables/brands"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "brands"

export const useBrandQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getBrands,
  })
}

export const useBrandQueryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getBrandById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useCreateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (brand: BrandInsert) => createBrand(brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Brand created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, brand }: { id: string; brand: BrandUpdate }) => updateBrand(id, brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Brand updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Brand deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
