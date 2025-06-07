import type { Json } from "../supabase"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category_id: string
  brand_id: string
  is_active: boolean
  is_featured: boolean
  stock_quantity: number
  sku: string
  created_at: string
  updated_at: string
}

export interface ProductInsert {
  id?: string
  name: string
  slug: string
  description?: string | null
  short_description?: string | null
  brand_id?: string | null
  category_id?: string | null
  old_price?: number | null
  price: number
  stock_quantity?: number
  low_stock_threshold?: number
  weight?: number | null
  dimensions?: Json | null
  ingredients?: string | null
  how_to_use?: string | null
  is_active?: boolean
  is_featured?: boolean
  images?: string[] | null
  tags?: string[] | null
  created_at?: string
  updated_at?: string
}

export type ProductUpdate = Partial<Omit<Product, "id" | "created_at" | "updated_at">>
