import type { Product } from "./products"

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id?: string
  product_name: string
  variant_name?: string
  price: number
  quantity: number
  total_price: number
  created_at: string
  updated_at: string
  product?: Pick<Product, "id" | "name" | "images">
}

export interface OrderItemInsert {
  id?: string
  order_id?: string
  product_id: string
  variant_id?: string | null
  product_name: string
  variant_name?: string | null
  price: number
  quantity: number
  total_price: number
  created_at?: string
}

export interface OrderItemUpdate {
  id?: string
  order_id?: string
  product_id?: string | null
  variant_id?: string | null
  product_name?: string
  variant_name?: string | null
  price?: number
  quantity?: number
  total_price?: number
  created_at?: string
}
