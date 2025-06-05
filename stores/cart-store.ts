import { supabase } from "@/utils/supabase/client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: async (item: CartItem) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const currentItems = get().items
        const existingItem = currentItems.find((i) => i.id === item.id)

        let newItems: CartItem[]
        if (existingItem) {
          newItems = currentItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        } else {
          newItems = [...currentItems, item]
        }

        // Update local state
        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        })

        // Sync with database if user is logged in
        if (session) {
          const userId = session.user.id
          if (existingItem) {
            // Update quantity if item exists
            await supabase
              .from("cart_items")
              .update({ quantity: existingItem.quantity + item.quantity })
              .eq("user_id", userId)
              .eq("product_id", item.id)
          } else {
            // Insert new item
            await supabase.from("cart_items").insert({
              user_id: userId,
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
            })
          }
        }
      },

      removeItem: async (itemId: string) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const newItems = get().items.filter((item) => item.id !== itemId)

        // Update local state
        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        })

        // Remove from database if user is logged in
        if (session) {
          await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", session.user.id)
            .eq("product_id", itemId)
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const newItems = get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )

        // Update local state
        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        })

        // Update in database if user is logged in
        if (session) {
          await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("user_id", session.user.id)
            .eq("product_id", itemId)
        }
      },

      clearCart: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Clear local state
        set({ items: [], total: 0 })

        // Clear database items if user is logged in
        if (session) {
          await supabase.from("cart_items").delete().eq("user_id", session.user.id)
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
