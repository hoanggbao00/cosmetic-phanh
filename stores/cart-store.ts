import { supabase } from "@/utils/supabase/client"
import { toast } from "sonner"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image?: string
  quantity: number
  variantId?: string
}

interface CartState {
  items: CartItem[]
  addItem: (product: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (product) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.productId && item.variantId === product.variantId
          )

          let newItems: CartItem[]
          let cartItemId: string

          if (existingItem) {
            newItems = state.items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            )
            cartItemId = existingItem.id
          } else {
            cartItemId = crypto.randomUUID()
            newItems = [...state.items, { ...product, id: cartItemId }]
          }

          // Update local state
          return { items: newItems }
        })

        // Sync with database if user is logged in
        if (session) {
          const userId = session.user.id
          const existingItem = get().items.find(
            (item) => item.productId === product.productId && item.variantId === product.variantId
          )

          if (existingItem) {
            // Update quantity if item exists
            await supabase
              .from("cart_items")
              .update({
                quantity: existingItem.quantity,
              })
              .eq("user_id", userId)
              .eq("product_id", product.productId)
              .eq("variant_id", product.variantId || null)
          } else {
            // Insert new item
            await supabase.from("cart_items").insert({
              id: crypto.randomUUID(),
              user_id: userId,
              product_id: product.productId,
              variant_id: product.variantId || null,
              quantity: product.quantity,
            })
          }
        }

        toast.success("Added to cart", {
          description: `${product.name} added to cart`,
        })
      },

      removeItem: async (id) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Update local state
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))

        // Remove from database if user is logged in
        if (session) {
          await supabase.from("cart_items").delete().eq("user_id", session.user.id).eq("id", id)
        }
      },

      updateQuantity: async (id, quantity) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Update local state
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }))

        // Update in database if user is logged in
        if (session) {
          const item = get().items.find((item) => item.id === id)
          if (item) {
            await supabase
              .from("cart_items")
              .update({ quantity })
              .eq("user_id", session.user.id)
              .eq("product_id", item.productId)
              .eq("variant_id", item.variantId || null)
          }
        }
      },

      clearCart: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Clear local state
        set({ items: [] })

        // Clear database items if user is logged in
        if (session) {
          await supabase.from("cart_items").delete().eq("user_id", session.user.id)
        }
      },

      get total() {
        return get().items.reduce((total, item) => {
          return total + item.price * item.quantity
        }, 0)
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
