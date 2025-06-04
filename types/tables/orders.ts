import type { Json } from "../supabase"
import type { OrderItem } from "./order_items"

export interface AddressType {
  full_name: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string | null
}

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
  shipping_amount: number
  discount_amount: number
  total_amount: number
  voucher_id: string | null
  voucher_code: string | null
  shipping_address: AddressType
  payment_method: string | null
  payment_details: Json | null
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  customer_notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[] | null
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
  shipping_amount?: number
  discount_amount?: number
  total_amount: number
  voucher_id?: string | null
  voucher_code?: string | null
  shipping_address: AddressType
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
  shipping_amount?: number
  discount_amount?: number
  total_amount?: number
  voucher_id?: string | null
  voucher_code?: string | null
  shipping_address?: AddressType
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
