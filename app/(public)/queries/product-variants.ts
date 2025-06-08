import { getVariants } from "@/app/(public)/actions/get-variants"
import { useQuery } from "@tanstack/react-query"

export const useProductVariantsQuery = () => {
  return useQuery({
    queryKey: ["variants"],
    queryFn: getVariants,
  })
}
