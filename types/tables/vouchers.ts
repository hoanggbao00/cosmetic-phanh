export interface Voucher {
  id: string
  code: string
  name: string
  description: string | null
  type: "percentage" | "fixed_amount"
  value: number
  minimum_order_amount: number | null
  maximum_discount_amount: number | null
  usage_limit: number | null
  used_count: number
  user_usage_limit: number
  is_active: boolean
  starts_at: string
  expires_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}
export interface VoucherInsert {
  id?: string
  code: string
  name: string
  description?: string | null
  type: "percentage" | "fixed_amount"
  value: number
  minimum_order_amount?: number | null
  maximum_discount_amount?: number | null
  usage_limit?: number | null
  used_count?: number
  user_usage_limit?: number
  is_active?: boolean
  starts_at?: string
  expires_at?: string | null
  created_by?: string | null
  created_at?: string
  updated_at?: string
}
export interface VoucherUpdate {
  id?: string
  code?: string
  name?: string
  description?: string | null
  type?: "percentage" | "fixed_amount"
  value?: number
  minimum_order_amount?: number | null
  maximum_discount_amount?: number | null
  usage_limit?: number | null
  used_count?: number
  user_usage_limit?: number
  is_active?: boolean
  starts_at?: string
  expires_at?: string | null
  created_by?: string | null
  created_at?: string
  updated_at?: string
}
