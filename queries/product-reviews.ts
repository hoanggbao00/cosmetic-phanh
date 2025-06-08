import {
  deleteProductReview,
  getProductReviews,
  updateProductReview,
} from "@/actions/product-reviews"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useProductReviewsQuery = () => {
  return useQuery({
    queryKey: ["product-reviews"],
    queryFn: getProductReviews,
  })
}

export const useProductReviewUpdateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, adminReply }: { id: string; adminReply: string }) =>
      updateProductReview(id, adminReply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] })
      toast.success("Review reply updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update review reply")
      console.error(error)
    },
  })
}

export const useProductReviewDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProductReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] })
      toast.success("Review deleted successfully")
    },
    onError: (error) => {
      toast.error("Failed to delete review")
      console.error(error)
    },
  })
}
