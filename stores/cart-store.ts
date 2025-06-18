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
  addItem: (product: Omit<CartItem, "id">) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  updateTotal: () => void
  total: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: async (product) => {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // If user is logged in, check database first
        if (session) {
          const userId = session.user.id
          const query = supabase
            .from("cart_items")
            .select("*")
            .eq("user_id", userId)
            .eq("product_id", product.productId)

          if (product.variantId) {
            query.eq("variant_id", product.variantId)
          }

          const { data: existingDbItem } = await query

          if (existingDbItem && existingDbItem.length > 0) {
            // Update quantity if item exists in database
            await supabase
              .from("cart_items")
              .update({
                quantity: existingDbItem[0].quantity + product.quantity,
              })
              .eq("id", existingDbItem[0].id)

            // Update local state
            set((state) => {
              const existingItem = state.items.find(
                (item) =>
                  item.productId === product.productId && item.variantId === product.variantId
              )

              if (existingItem) {
                return {
                  items: state.items.map((item) =>
                    item.id === existingItem.id
                      ? { ...item, quantity: item.quantity + product.quantity }
                      : item
                  ),
                }
              }

              const cartItemId = crypto.randomUUID()
              return {
                items: [...state.items, { ...product, id: cartItemId }],
              }
            })
          } else {
            // Insert new item
            const newId = crypto.randomUUID()
            await supabase.from("cart_items").insert({
              id: newId,
              user_id: userId,
              product_id: product.productId,
              ...(product.variantId && { variant_id: product.variantId }),
              quantity: product.quantity,
            })

            // Update local state
            set((state) => ({
              items: [...state.items, { ...product, id: newId }],
            }))
          }
        } else {
          // Handle local state for non-logged in users
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

            return { items: newItems }
          })
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

        get().updateTotal()

        // Update in database if user is logged in
        if (session) {
          const item = get().items.find((item) => item.id === id)
          if (item) {
            await supabase
              .from("cart_items")
              .update({ quantity })
              .eq("user_id", session.user.id)
              .eq("product_id", item.productId)
              .eq("variant_id", item.variantId ?? null)
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

      updateTotal: () => {
        const total = get().items.reduce((total, item) => total + item.price * item.quantity, 0)
        set({ total })
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
