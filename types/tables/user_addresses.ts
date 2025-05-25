export interface UserAddress {
  id: string;
  user_id: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state_province: string | null;
  postal_code: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
export interface UserAddressInsert {
  id?: string;
  user_id: string;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state_province?: string | null;
  postal_code?: string | null;
  country?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface UserAddressUpdate {
  id?: string;
  user_id?: string;
  address_line_1?: string;
  address_line_2?: string | null;
  city?: string;
  state_province?: string | null;
  postal_code?: string | null;
  country?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}
