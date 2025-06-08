import {
  addToWishlist,
  getWishlistItems,
  isInWishlist,
  removeFromWishlist,
} from "@/actions/wishlist"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "wishlist"

export const useWishlistItems = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => getWishlistItems(userId!),
    enabled: !!userId,
  })
}

export const useIsInWishlist = (userId: string | null, productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, "check", userId, productId],
    queryFn: () => isInWishlist(userId!, productId),
    enabled: !!userId,
  })
}

export const useAddToWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      addToWishlist(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Added to wishlist")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      removeFromWishlist(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Removed from wishlist")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
