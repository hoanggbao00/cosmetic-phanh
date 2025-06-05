import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const WISHLIST_KEYS = {
  all: ["wishlist"],
  list: (userId: string) => ["wishlist", "list", userId],
  isInWishlist: (productId: string, userId: string) => [
    "wishlist",
    "isInWishlist",
    productId,
    userId,
  ],
}

export const useWishlistQuery = (userId?: string) => {
  return useQuery({
    queryKey: userId ? WISHLIST_KEYS.list(userId) : WISHLIST_KEYS.all,
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*, product:products(*)")
        .eq("user_id", userId)
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export const useToggleWishlistMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      userId,
    }: {
      productId: string
      userId: string
    }) => {
      // First check if item exists
      const { data: existingItems } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", userId)

      const existingItem = existingItems?.[0]

      if (existingItem) {
        // Remove from wishlist
        const { error } = await supabase.from("wishlist_items").delete().eq("id", existingItem.id)
        if (error) throw error
        return { added: false }
      }
      // Add to wishlist
      const { error } = await supabase.from("wishlist_items").insert({
        product_id: productId,
        user_id: userId,
      })
      if (error) throw error
      return { added: true }
    },
    onSuccess: (result, variables) => {
      // Invalidate both the list and the isInWishlist queries
      queryClient.invalidateQueries({
        queryKey: WISHLIST_KEYS.list(variables.userId),
      })
      queryClient.invalidateQueries({
        queryKey: WISHLIST_KEYS.isInWishlist(variables.productId, variables.userId),
      })
      toast.success(result.added ? "Added to wishlist" : "Removed from wishlist")
    },
    onError: () => {
      toast.error("Failed to update wishlist")
    },
  })
}

export const useIsInWishlist = (productId: string, userId?: string) => {
  return useQuery({
    queryKey: userId ? WISHLIST_KEYS.isInWishlist(productId, userId) : WISHLIST_KEYS.all,
    queryFn: async () => {
      if (!userId) return false
      const { data } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", userId)

      return data && data.length > 0
    },
    enabled: !!userId && !!productId,
  })
}
