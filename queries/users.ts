import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { User, UserInsert, UserUpdate } from "@/types/tables/users"
import { supabase } from "@/utils/supabase/client"

// Query key
const USERS_QUERY_KEY = "users"

// Get all users
export const useUsersQuery = () => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as User[]
    },
  })
}

// Get user by ID
export const useUserQuery = (id: string | null) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()
      if (error) throw error
      return data as User
    },
    enabled: !!id,
  })
}

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: UserInsert) => {
      const { data, error } = await supabase.from("profiles").insert(user).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
      toast.success("User created successfully")
    },
    onError: (error) => {
      toast.error("Failed to create user")
      console.error("Error creating user:", error)
    },
  })
}

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: UserUpdate) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(user)
        .eq("id", user.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
      toast.success("User updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update user")
      console.error("Error updating user:", error)
    },
  })
}

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
      toast.success("User deleted successfully")
    },
    onError: (error) => {
      toast.error("Failed to delete user")
      console.error("Error deleting user:", error)
    },
  })
}
