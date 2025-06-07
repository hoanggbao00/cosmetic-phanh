import type { Product } from "@/types/tables/products"
import { supabase } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

export const useProductQuery = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, images")
        .order("name")

      if (error) throw error
      return data as Product[]
    },
  })
}
