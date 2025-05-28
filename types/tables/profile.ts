export interface Profiles {
  avatar_url: string | null;
  created_at: string | null;
  date_of_birth: string | null;
  email: string;
  full_name: string | null;
  gender: string | null;
  id: string;
  phone: string | null;
  role: string | null;
  updated_at: string | null;
}
export interface ProfilesInsert {
  avatar_url?: string | null;
  created_at?: string | null;
  date_of_birth?: string | null;
  email: string;
  full_name?: string | null;
  gender?: string | null;
  id: string;
  phone?: string | null;
  role?: string | null;
  updated_at?: string | null;
}
export interface ProfilesUpdate {
  avatar_url?: string | null;
  created_at?: string | null;
  date_of_birth?: string | null;
  email?: string;
  full_name?: string | null;
  gender?: string | null;
  id?: string;
  phone?: string | null;
  role?: string | null;
  updated_at?: string | null;
}
