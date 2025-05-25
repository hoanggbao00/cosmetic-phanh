export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  notes: string | null;
  updated_by: string | null;
  created_at: string;
}
export interface OrderStatusHistoryInsert {
  id?: string;
  order_id: string;
  status: string;
  notes?: string | null;
  updated_by?: string | null;
  created_at?: string;
}
export interface OrderStatusHistoryUpdate {
  id?: string;
  order_id?: string;
  status?: string;
  notes?: string | null;
  updated_by?: string | null;
  created_at?: string;
}
