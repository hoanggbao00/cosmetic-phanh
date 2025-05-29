import type { Json } from "../supabase"

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  old_price: number | null
  price: number
  stock_quantity: number
  variant_options: Json | null
  is_active: boolean
  created_at: string
  updated_at: string
}
export interface ProductVariantInsert {
  id?: string
  product_id: string
  name: string
  old_price?: number | null
  price: number
  stock_quantity?: number
  variant_options?: Json | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}
export interface ProductVariantUpdate {
  id?: string
  product_id?: string
  name?: string
  old_price?: number | null
  price?: number
  stock_quantity?: number
  variant_options?: Json | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}
