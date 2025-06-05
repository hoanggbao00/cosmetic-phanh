export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  date: string
  readTime: number
  author: {
    name: string
    avatar: string
  }
  category_id: string
  featured?: boolean
}
