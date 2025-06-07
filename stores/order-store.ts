import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface OrderStore {
  currentOrderId: string | null
  setCurrentOrderId: (orderId: string | null) => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      currentOrderId: null,
      setCurrentOrderId: (orderId) => set({ currentOrderId: orderId }),
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
