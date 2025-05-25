export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  images: string[] | null;
  admin_reply: string | null;
  admin_reply_at: string | null;
  admin_reply_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductReviewInsert {
  id?: string;
  product_id: string;
  user_id: string;
  order_id?: string | null;
  rating: number;
  comment?: string | null;
  images?: string[] | null;
  admin_reply?: string | null;
  admin_reply_at?: string | null;
  admin_reply_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductReviewUpdate {
  id?: string;
  product_id?: string;
  user_id?: string;
  order_id?: string | null;
  rating?: number;
  comment?: string | null;
  images?: string[] | null;
  admin_reply?: string | null;
  admin_reply_at?: string | null;
  admin_reply_by?: string | null;
  created_at?: string;
  updated_at?: string;
}
