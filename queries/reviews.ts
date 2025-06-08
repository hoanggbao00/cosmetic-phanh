import { createReview, deleteReview, replyToReview } from "@/actions/reviews"
import type { ReplyData, ReviewData } from "@/types/reviews"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean } | { error: string }, Error, ReviewData>({
    mutationFn: (data) => createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean } | { error: string }, Error, string>({
    mutationFn: (reviewId) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}

export const useReplyToReview = () => {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean } | { error: string }, Error, ReplyData>({
    mutationFn: (data) => replyToReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}
