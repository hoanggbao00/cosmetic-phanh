"use server"

import type { Profiles } from "@/types/tables"
import { createSupabaseServerClient } from "@/utils/supabase/server"

export type UserData = {
  id: string
  email: string
  profile: Profiles
}

export async function getCurrentUser(): Promise<UserData | null> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) return null

  return {
    id: user.id,
    email: user.email,
    profile,
  }
}
