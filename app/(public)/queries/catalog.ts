import { getCatalog } from "@/app/(public)/actions/get-catalog"
import { useQuery } from "@tanstack/react-query"

export const useCatalogQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCatalog,
  })
}
