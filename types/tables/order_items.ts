export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  product_name: string
  variant_name: string | null
  price: number
  quantity: number
  total_price: number
  created_at: string
}

export interface OrderItemInsert {
  id?: string
  order_id: string
  product_id?: string | null
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
