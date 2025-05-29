import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  color?: string
  size?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  itemCount: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const { items } = get()
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          // If item exists, update quantity
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          })
        } else {
          // Add new item
          set({ items: [...items, item] })
        }

        toast.success("Product added to cart", {
          description: `${item.name} added to cart`,
        })
      },

      removeItem: (id: number) => {
        const { items } = get()
        set({ items: items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id: number, quantity: number) => {
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
    }),
    {
      name: "cart-storage", // name of the item in localStorage
      skipHydration: true, // Skip hydration to prevent hydration mismatch errors
    }
  )
)
