import { getProducts } from "@/app/(public)/actions/get-products"
import { useQuery } from "@tanstack/react-query"

export const useProductQuery = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })
}
