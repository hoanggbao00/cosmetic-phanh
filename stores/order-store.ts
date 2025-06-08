import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface OrderHistory {
  orderId: string
  total: number
  status: "pending" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: string
  items: {
    productId: string
    name: string
    variantId?: string
    variantName?: string
    price: number
    quantity: number
  }[]
}

interface OrderState {
  orderHistory: OrderHistory[]
  localOrderIds: string[] // Store order IDs for guest users
  addToHistory: (order: OrderHistory) => void
  addLocalOrder: (orderId: string) => void
  clearHistory: () => void
  clearLocalOrders: () => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orderHistory: [],
      localOrderIds: [],
      addToHistory: (order) =>
        set((state) => ({
          orderHistory: [...state.orderHistory, order],
        })),
      addLocalOrder: (orderId) =>
        set((state) => ({
          localOrderIds: [...state.localOrderIds, orderId],
        })),
      clearHistory: () => set({ orderHistory: [] }),
      clearLocalOrders: () => set({ localOrderIds: [] }),
    }),
    {
      name: "order-storage",
    }
  )
)
