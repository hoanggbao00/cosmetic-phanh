import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type {
  ProductVariant,
  ProductVariantInsert,
  ProductVariantUpdate,
} from "@/types/tables/product_variants"
import { supabase } from "@/utils/supabase/client"

// Query key
const PRODUCT_VARIANTS_QUERY_KEY = "product-variants"

// Get all product variants
export const useProductVariantsQuery = () => {
  return useQuery({
    queryKey: [PRODUCT_VARIANTS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_variants").select("*")
      if (error) throw error
      return data as ProductVariant[]
    },
  })
}

// Get product variants by product ID
export const useProductVariantsByProductQuery = (productId: string) => {
  return useQuery({
    queryKey: [PRODUCT_VARIANTS_QUERY_KEY, productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
      if (error) throw error
      return data as ProductVariant[]
    },
  })
}

// Create product variant
export const useCreateProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variant: ProductVariantInsert) => {
      const { data, error } = await supabase
        .from("product_variants")
        .insert(variant)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_VARIANTS_QUERY_KEY] })
      toast.success("Product variant created successfully")
    },
    onError: (error) => {
      toast.error("Failed to create product variant")
      console.error("Error creating product variant:", error)
    },
  })
}

// Update product variant
export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variant: ProductVariantUpdate) => {
      const { data, error } = await supabase
        .from("product_variants")
        .update(variant)
        .eq("id", variant.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_VARIANTS_QUERY_KEY] })
      toast.success("Product variant updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update product variant")
      console.error("Error updating product variant:", error)
    },
  })
}

// Delete product variant
export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_variants").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_VARIANTS_QUERY_KEY] })
      toast.success("Product variant deleted successfully")
    },
    onError: (error) => {
      toast.error("Failed to delete product variant")
      console.error("Error deleting product variant:", error)
    },
  })
}
