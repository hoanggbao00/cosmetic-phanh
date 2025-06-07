"use client"

import { getProducts } from "@/app/actions/product"
import type { Product } from "@/types/tables/products"
import { useQuery } from "@tanstack/react-query"

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  })
}
