"use client"

import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrdersByIds,
  getOrdersByUser,
  updateOrder,
} from "@/actions/orders"
import type { OrderInsert, OrderUpdate } from "@/types/tables/orders"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "orders"

interface OrdersParams {
  page?: number
  limit?: number
  searchQuery?: string
  status?: string
  isPaginated?: boolean
}

export const useOrders = (params?: OrdersParams) => {
  const { page = 1, limit = 10, searchQuery = "", status, isPaginated = true } = params || {}

  return useQuery({
    queryKey: [QUERY_KEY, { page, limit, searchQuery, status, isPaginated }],
    queryFn: () => getOrders({ page, limit, searchQuery, status, isPaginated }),
  })
}

export const useOrderById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getOrderById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useOrdersByUser = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, "user", userId],
    queryFn: () => getOrdersByUser(userId!),
    enabled: !!userId,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (order: OrderInsert) => createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Order created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, order }: { id: string; order: OrderUpdate }) => updateOrder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Order updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Order deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useOrdersByIds(orderIds: string[]) {
  // Filter out empty strings and undefined values
  const validOrderIds = orderIds.filter((id): id is string => !!id)

  return useQuery({
    queryKey: ["orders", validOrderIds],
    queryFn: () => getOrdersByIds(validOrderIds),
    enabled: validOrderIds.length > 0,
  })
}
