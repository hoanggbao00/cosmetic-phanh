export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}
export interface WishlistItemInsert {
  id?: string;
  user_id: string;
  product_id: string;
  created_at?: string;
}
export interface WishlistItemUpdate {
  id?: string;
  user_id?: string;
  product_id?: string;
  created_at?: string;
}
