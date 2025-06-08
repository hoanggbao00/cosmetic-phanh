import { supabase } from "@/utils/supabase/client"
import { toast } from "sonner"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variantId?: string
  variantName?: string
  variantPrice?: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => Promise<void>
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

      addItem: async (item) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const currentItems = get().items
        const existingItemIndex = currentItems.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        )

        let newItems: CartItem[]
        let cartItemId: string

        if (existingItemIndex !== -1) {
          newItems = [...currentItems]
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + item.quantity,
          }
          cartItemId = newItems[existingItemIndex].id
        } else {
          cartItemId = crypto.randomUUID()
          newItems = [...currentItems, { ...item, id: cartItemId }]
        }

        // Update local state
        set({
          items: newItems,
          total: newItems.reduce((acc, item) => {
            // Use variant price if available, otherwise use base price
            const itemPrice = item.variantPrice || item.price
            return acc + itemPrice * item.quantity
          }, 0),
        })

        // Sync with database if user is logged in
        if (session) {
          const userId = session.user.id
          if (existingItemIndex !== -1) {
            // Update quantity if item exists
            await supabase
              .from("cart_items")
              .update({
                quantity: newItems[existingItemIndex].quantity,
              })
              .eq("user_id", userId)
              .eq("product_id", item.productId)
              .eq("variant_id", item.variantId || null)
          } else {
            // Insert new item
            await supabase.from("cart_items").insert({
              id: cartItemId,
              user_id: userId,
              product_id: item.productId,
              variant_id: item.variantId || null,
              quantity: item.quantity,
            })
          }
        }

        toast.success("Added to cart", {
          description: `${item.name}${item.variantName ? ` (${item.variantName})` : ""} added to cart`,
        })
      },

      removeItem: async (itemId: string) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const newItems = get().items.filter((item) => item.id !== itemId)

        // Update local state
        set({
          items: newItems,
          total: newItems.reduce((acc, item) => {
            const itemPrice = item.variantPrice || item.price
            return acc + itemPrice * item.quantity
          }, 0),
        })

        // Remove from database if user is logged in
        if (session) {
          await supabase.from("cart_items").delete().eq("user_id", session.user.id).eq("id", itemId)
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
          total: newItems.reduce((acc, item) => {
            const itemPrice = item.variantPrice || item.price
            return acc + itemPrice * item.quantity
          }, 0),
        })

        // Update in database if user is logged in
        if (session) {
          await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("user_id", session.user.id)
            .eq("id", itemId)
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
      storage: createJSONStorage(() => localStorage),
    }
  )
)
