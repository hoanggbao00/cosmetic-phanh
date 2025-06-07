"use client"

import { getProductVariantsByProduct } from "@/app/actions/product-variants"
import type { ProductVariant } from "@/types/tables/product_variants"
import { useQueries, useQuery } from "@tanstack/react-query"

export const useProductVariants = (productId: string) => {
  return useQuery<ProductVariant[]>({
    queryKey: ["product-variants", productId],
    queryFn: () => getProductVariantsByProduct(productId),
    enabled: !!productId,
  })
}

export const useMultipleProductVariants = (productIds: string[]) => {
  return useQueries({
    queries: productIds.map((productId) => ({
      queryKey: ["product-variants", productId],
      queryFn: () => getProductVariantsByProduct(productId),
      enabled: !!productId,
    })),
  })
}
