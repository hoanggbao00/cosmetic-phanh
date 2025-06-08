"use client"

import { updateOrderAction } from "@/app/admin/orders/[id]/actions"
import type { Order, OrderUpdate } from "@/types/tables/orders"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface CartItem {
  product: {
    id: string
    price: number
  }
  quantity: number
  variant?: {
    id: string
  } | null
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Order deleted successfully")
    },
    onError: (error) => {
      console.error("Failed to delete order:", error)
      toast.error("Failed to delete order")
    },
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...order }: OrderUpdate & { id: string }) => {
      const { data, error } = await updateOrderAction(id, order)

      if (error) {
        throw error
      }

      return data as Order
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["orders", data.id] })
      toast.success("Order updated successfully")
    },
    onError: (error) => {
      console.error("Failed to update order:", error)
      toast.error("Failed to update order")
    },
  })
}

export function useCreateOrderMutation(onSuccess?: (orderId: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      formData,
      cartItems,
      subtotal,
      shipping,
      discount,
      total,
      voucher_id,
      voucher_code,
    }: {
      formData: {
        full_name: string
        email: string
        phone: string
        address: string
        city: string
        payment_method: string
        notes?: string
      }
      cartItems: CartItem[]
      subtotal: number
      shipping: number
      discount: number
      total: number
      voucher_id: string | null
      voucher_code: string | null
    }) => {
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          payment_method: formData.payment_method,
          notes: formData.notes,
          subtotal,
          shipping_fee: shipping,
          discount,
          total,
          voucher_id,
          voucher_code,
          status: formData.payment_method === "online_banking" ? "pending_payment" : "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        variant_id: item.variant?.id || null,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // If using a voucher, increment its usage count
      if (voucher_id) {
        const { error: voucherError } = await supabase.rpc("increment_voucher_usage", {
          voucher_id,
        })

        if (voucherError) throw voucherError
      }

      return orderData.id
    },
    onSuccess: (orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      onSuccess?.(orderId)
    },
    onError: (error) => {
      console.error("Failed to create order:", error)
      toast.error("Failed to create order")
    },
  })
}
