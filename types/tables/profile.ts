export interface Profiles {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}
export interface ProfilesInsert {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: "male" | "female" | "other" | null;
  role?: "user" | "admin";
  created_at?: string;
  updated_at?: string;
}
export interface ProfilesUpdate {
  id?: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: "male" | "female" | "other" | null;
  role?: "user" | "admin";
  created_at?: string;
  updated_at?: string;
}
