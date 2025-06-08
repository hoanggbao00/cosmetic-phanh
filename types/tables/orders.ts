import type { Json } from "../supabase"
import type { OrderItem, OrderItemInsert } from "./order_items"
import type { Profiles } from "./profile"

export interface AddressType {
  full_name: string
  address_line1: string
  address_line2: string | null
  city: string
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
  payment_method: "cash" | "card" | "bank_transfer"
  shipping_amount: number
  discount_amount: number
  total_amount: number
  shipping_address: {
    full_name: string
    address_line1: string
    address_line2?: string
    city: string
    phone: string
  }
  voucher_id?: string
  voucher_code?: string
  customer_notes?: string
  admin_notes?: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
  user?: Profiles
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
  order_items?: OrderItemInsert[]
}

export type OrderUpdate = Partial<Omit<Order, "id" | "created_at" | "updated_at">>
