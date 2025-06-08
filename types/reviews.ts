export interface ReviewData {
  productId: string
  userId: string
  rating: number
  comment: string
}

export interface ReplyData {
  reviewId: string
  reply: string
  reply_at?: string
  reply_by?: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    name: string | null
    avatar_url: string | null
  }
  reply?: {
    id: string
    content: string
    adminId: string
    createdAt: string
    admin: {
      id: string
      name: string | null
    }
  }
}
