import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
} from "@/actions/products"
import type { ProductInsert, ProductUpdate } from "@/types/tables/products"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "products"

export const useProductQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getProducts,
  })
}

export const useFeaturedProductsQuery = (limit = 3) => {
  return useQuery({
    queryKey: [QUERY_KEY, "featured", limit],
    queryFn: () => getFeaturedProducts(limit),
  })
}

export const useProductQueryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getProductById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: ProductInsert) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Product created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: ProductUpdate }) =>
      updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Product updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Product deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, "search", query],
    queryFn: () => searchProducts(query),
    enabled: !!query,
  })
}
