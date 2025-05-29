import type { Json } from "../supabase"

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  guest_email: string | null
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded"
  payment_status: "pending" | "paid" | "failed" | "refunded" | "partially_refunded"
  subtotal: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  voucher_id: string | null
  voucher_code: string | null
  shipping_address: Json
  billing_address: Json | null
  payment_method: string | null
  payment_details: Json | null
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  customer_notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}
export interface OrderInsert {
  id?: string
  order_number?: string
  user_id?: string | null
  guest_email?: string | null
  status?:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded"
  payment_status?: "pending" | "paid" | "failed" | "refunded" | "partially_refunded"
  subtotal: number
  shipping_amount?: number
  discount_amount?: number
  total_amount: number
  voucher_id?: string | null
  voucher_code?: string | null
  shipping_address: Json
  billing_address?: Json | null
  payment_method?: string | null
  payment_details?: Json | null
  tracking_number?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
  customer_notes?: string | null
  admin_notes?: string | null
  created_at?: string
  updated_at?: string
}
export interface OrderUpdate {
  id?: string
  order_number?: string
  user_id?: string | null
  guest_email?: string | null
  status?:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded"
  payment_status?: "pending" | "paid" | "failed" | "refunded" | "partially_refunded"
  subtotal?: number
  shipping_amount?: number
  discount_amount?: number
  total_amount?: number
  voucher_id?: string | null
  voucher_code?: string | null
  shipping_address?: Json
  billing_address?: Json | null
  payment_method?: string | null
  payment_details?: Json | null
  tracking_number?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
  customer_notes?: string | null
  admin_notes?: string | null
  created_at?: string
  updated_at?: string
}
