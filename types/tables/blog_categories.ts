export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
export interface BlogCategoryInsert {
  id?: string
  name: string
  slug: string
  description?: string | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}
export interface BlogCategoryUpdate {
  id?: string
  name?: string
  slug?: string
  description?: string | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}
