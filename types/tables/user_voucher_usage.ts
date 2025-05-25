export interface UserVoucherUsage {
  id: string;
  user_id: string;
  voucher_id: string;
  used_count: number;
  first_used_at: string;
  last_used_at: string;
}
export interface UserVoucherUsageInsert {
  id?: string;
  user_id: string;
  voucher_id: string;
  used_count?: number;
  first_used_at?: string;
  last_used_at?: string;
}
export interface UserVoucherUsageUpdate {
  id?: string;
  user_id?: string;
  voucher_id?: string;
  used_count?: number;
  first_used_at?: string;
  last_used_at?: string;
}
