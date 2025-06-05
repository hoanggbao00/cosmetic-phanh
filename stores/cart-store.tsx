import type { Tables } from "@/types/supabase"
import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  variant?: Tables<"product_variants">
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: () => number
  totalPrice: () => number
  getItemsByProduct: (productId: string) => CartItem[]
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.variant?.id === item.variant?.id
        )

        if (existingItem) {
          // If item exists with same variant and size, update quantity
          set({
            items: items.map((i) =>
              i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          })
        } else {
          // Add new item with unique id
          const newItem = {
            ...item,
            id: crypto.randomUUID(),
          }
          set({ items: [...items, newItem] })
        }

        toast.success("Product added to cart", {
          description: `${item.name} added to cart`,
        })
      },

      removeItem: (id: string) => {
        const { items } = get()
        set({ items: items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id: string, quantity: number) => {
        const { items } = get()
        set({
          items: items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      totalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemsByProduct: (productId: string) => {
        const { items } = get()
        return items.filter((item) => item.productId === productId)
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    }
  )
)
