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
  currentOrderId: string | null
  orderHistory: OrderHistory[]
  setCurrentOrderId: (orderId: string) => void
  addToHistory: (order: OrderHistory) => void
  clearCurrentOrder: () => void
  clearHistory: () => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      currentOrderId: null,
      orderHistory: [],
      setCurrentOrderId: (orderId) => set({ currentOrderId: orderId }),
      addToHistory: (order) =>
        set((state) => ({
          orderHistory: [...state.orderHistory, order],
        })),
      clearCurrentOrder: () => set({ currentOrderId: null }),
      clearHistory: () => set({ orderHistory: [] }),
    }),
    {
      name: "order-storage",
    }
  )
)
