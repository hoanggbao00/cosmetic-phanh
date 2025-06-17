import { useCartStore } from "@/stores/cart-store"
import { supabase } from "@/utils/supabase/client"
import { useEffect } from "react"

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
  const store = useCartStore()
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

          // Update local cart state using store's set method
          useCartStore.setState({
            items: formattedItems,
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
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return items
}
