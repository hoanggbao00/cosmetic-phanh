"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { FilterAndSortParams } from "./catalog-page"

interface Props {
  searchParams: FilterAndSortParams
}

export const ClearFilter = ({ searchParams }: Props) => {
  const router = useRouter()

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("categories")
    params.delete("priceFrom")
    params.delete("priceTo")
    params.delete("colors")
    router.replace(`/catalog?${params.toString()}`)
  }

  return (
    <Button variant="link" onClick={handleClearFilter} className="mt-2">
      Clear all filters
    </Button>
  )
}
