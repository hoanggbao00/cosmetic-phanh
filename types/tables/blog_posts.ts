export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  tags: string[] | null;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface BlogPostInsert {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  category_id?: string | null;
  author_id?: string | null;
  status?: "draft" | "published" | "archived";
  is_featured?: boolean;
  tags?: string[] | null;
  view_count?: number;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
export interface BlogPostUpdate {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  featured_image?: string | null;
  category_id?: string | null;
  author_id?: string | null;
  status?: "draft" | "published" | "archived";
  is_featured?: boolean;
  tags?: string[] | null;
  view_count?: number;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
