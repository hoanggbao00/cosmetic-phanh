import type { Json } from "../supabase";

export interface SystemSetting {
  id: string;
  key: string;
  value: Json | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
export interface SystemSettingInsert {
  id?: string;
  key: string;
  value?: Json | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}
export interface SystemSettingUpdate {
  id?: string;
  key?: string;
  value?: Json | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}
