"use client"

import { getStoreConfig } from "@/actions/store-config"
import { useQuery } from "@tanstack/react-query"

const QUERY_KEY = "store-config"

export const useStoreConfigQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getStoreConfig,
  })
}
