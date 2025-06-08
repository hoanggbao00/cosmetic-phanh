import {
  deleteUser,
  getUserAddresses,
  getUserById,
  getUserOrders,
  getUserVouchers,
  getUsers,
  updateUser,
} from "@/actions/users"
import type { ProfilesUpdate } from "@/types/tables"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "users"

export const useUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getUsers,
  })
}

export const useUserById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getUserById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useUserAddresses = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, "addresses", userId],
    queryFn: () => getUserAddresses(userId!),
    enabled: !!userId,
  })
}

export const useUserVouchers = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, "vouchers", userId],
    queryFn: () => getUserVouchers(userId!),
    enabled: !!userId,
  })
}

export const useUserOrders = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, "orders", userId],
    queryFn: () => getUserOrders(userId!),
    enabled: !!userId,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, profile }: { id: string; profile: ProfilesUpdate }) =>
      updateUser(id, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("User updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("User deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
