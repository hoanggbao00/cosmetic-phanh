import { type CartItem, useCartStore } from "@/stores/cart-store"
import { supabase } from "@/utils/supabase/client"
import { useEffect } from "react"

interface CartStoreWithSet {
  items: CartItem[]
  total: number
  set: (state: { items: CartItem[]; total: number }) => void
}

interface CartItemFromDB {
  id: string
  quantity: number
  product_id: string
  variant_id: string | null
  products: {
    id: string
    name: string
    images: string[]
    price: number
  }
}

export function useSyncCart() {
  const store = useCartStore() as unknown as CartStoreWithSet
  const { items } = store

  useEffect(() => {
    const loadCartItems = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Load cart items from database
        const { data: cartItems } = await supabase
          .from("cart_items")
          .select(`
            id,
            quantity,
            product_id,
            variant_id,
            products (
              id,
              name,
              images,
              price
            )
          `)
          .eq("user_id", session.user.id)
          .returns<CartItemFromDB[]>()

        if (cartItems) {
          const formattedItems = cartItems.map((item) => ({
            id: item.id,
            productId: item.product_id,
            name: item.products.name,
            price: item.products.price,
            image: item.products.images[0] || "",
            quantity: item.quantity,
            variantId: item.variant_id || undefined,
          }))

          // Update local cart state
          store.set({
            items: formattedItems,
            total: formattedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
          })
        }
      }
    }

    // Load cart items initially
    loadCartItems()

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        loadCartItems()
      } else if (event === "SIGNED_OUT") {
        // Clear local cart when user signs out
        store.set({ items: [], total: 0 })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [store])

  return items
}
