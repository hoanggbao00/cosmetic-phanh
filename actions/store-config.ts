"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"

export interface StoreConfig {
  id: string
  dollar_ratio: number
  notification: string
}

export async function getStoreConfig(): Promise<StoreConfig | null> {
  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.from("store_config").select("*").limit(1).single()

    if (error) {
      console.error("Error fetching store config:", error)
      return null
    }

    return data as StoreConfig
  } catch (error) {
    console.error("Error in getStoreConfig:", error)
    return null
  }
}
