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

interface CreateOrderPayload {
  formData: {
    full_name: string
    email: string
    phone: string
    address_line1: string
    address_line2: string | null
    city: string
    payment_method: "cash" | "bank_transfer"
  }
  cartItems: Array<{
    product: {
      id: string
      price: number
    }
    quantity: number
    variant?: {
      id: string
    } | null
  }>
  subtotal: number
  shipping: number
  discount_amount: number
  total: number
  voucher_id: string | null
  voucher_code: string | null
}

export const useCreateOrderMutation = (onSuccess?: (orderId: string) => void) => {
  return useMutation({
    mutationFn: async ({
      formData,
      cartItems,
      subtotal,
      shipping,
      discount_amount,
      total,
      voucher_id,
      voucher_code,
    }: CreateOrderPayload) => {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          guest_email: formData.email,
          status: "pending",
          payment_status: "pending",
          payment_method: formData.payment_method,
          shipping_amount: shipping,
          discount_amount: discount_amount,
          total_amount: total,
          shipping_address: {
            full_name: formData.full_name,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2 || null,
            city: formData.city,
            phone: formData.phone,
          },
          voucher_id,
          voucher_code,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Get product details
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name")
        .in(
          "id",
          cartItems.map((item) => item.product.id)
        )

      if (productsError) throw productsError

      // Get variant details if needed
      const variantIds = cartItems
        .map((item) => item.variant?.id)
        .filter((id): id is string => id !== null && id !== undefined)

      let variants: Array<{ id: string; name: string }> = []
      if (variantIds.length > 0) {
        const { data: variantsData, error: variantsError } = await supabase
          .from("product_variants")
          .select("id, name")
          .in("id", variantIds)

        if (variantsError) throw variantsError
        variants = variantsData || []
      }

      // Create order items with product and variant names
      const { error: itemsError } = await supabase.from("order_items").insert(
        cartItems.map((item) => {
          const product = products?.find((p) => p.id === item.product.id)
          const variant = item.variant?.id ? variants.find((v) => v.id === item.variant?.id) : null

          return {
            order_id: order.id,
            product_id: item.product.id,
            variant_id: item.variant?.id || null,
            quantity: item.quantity,
            price: item.product.price,
            product_name: product?.name || "Unknown Product",
            variant_name: variant?.name || null,
            total_price: item.quantity * item.product.price,
          }
        })
      )

      if (itemsError) throw itemsError

      // Increment voucher usage if used
      if (voucher_id) {
        const { error: voucherError } = await supabase.rpc("increment_voucher_usage", {
          voucher_id,
        })

        if (voucherError) {
          console.error("Failed to increment voucher usage:", voucherError)
          // We don't throw here as the order is already created
        }
      }

      return order.id
    },
    onSuccess: (orderId) => {
      onSuccess?.(orderId)
    },
    onError: (error) => {
      console.error("Failed to create order:", error)
      toast.error("Failed to create order. Please try again.")
    },
  })
}
