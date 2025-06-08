import { supabase } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

export const useVariant = (variantId: string | undefined) => {
  return useQuery({
    queryKey: ["variant", variantId],
    queryFn: async () => {
      if (!variantId) return null

      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("id", variantId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!variantId,
  })
}
