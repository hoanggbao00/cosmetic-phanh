import {
  createProductVariant,
  deleteProductVariant,
  getProductVariantById,
  getProductVariants,
  getProductVariantsByProductId,
  getVariantDetails,
  updateProductVariant,
} from "@/actions/product-variants"
import type { ProductVariantInsert, ProductVariantUpdate } from "@/types/tables/product_variants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "product-variants"

export const useProductVariantsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getProductVariants,
  })
}

export const useProductVariantsByProductQuery = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, productId],
    queryFn: () => getProductVariantsByProductId(productId),
  })
}

export const useProductVariantById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getProductVariantById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useVariantDetails = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, "details", id],
    queryFn: () => getVariantDetails(id!),
    enabled: !!id && id !== "new",
  })
}

export const useCreateProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variant: ProductVariantInsert) => createProductVariant(variant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Product variant created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, variant }: { id: string; variant: ProductVariantUpdate }) =>
      updateProductVariant(id, variant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Product variant updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProductVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Product variant deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
