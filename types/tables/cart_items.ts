export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
}
export interface CartItemInsert {
  id?: string;
  user_id?: string | null;
  session_id?: string | null;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}
export interface CartItemUpdate {
  id?: string;
  user_id?: string | null;
  session_id?: string | null;
  product_id?: string;
  variant_id?: string | null;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
}
