export interface ReviewData {
  productId: string
  userId: string
  rating: number
  comment: string
}

export interface ReplyData {
  reviewId: string
  reply: string
}

export interface ReviewResponse {
  success?: boolean
  error?: string
}
