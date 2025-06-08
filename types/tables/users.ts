export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "admin" | "user"
  created_at: string
  updated_at: string
}

export interface UserInsert {
  id?: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  role?: "admin" | "user"
  created_at?: string
  updated_at?: string
}

export interface UserUpdate {
  id?: string
  email?: string
  full_name?: string | null
  avatar_url?: string | null
  role?: "admin" | "user"
  created_at?: string
  updated_at?: string
}
