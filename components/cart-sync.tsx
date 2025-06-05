"use client"

import { useSyncCart } from "@/hooks/use-sync-cart"

export default function CartSync() {
  // This component doesn't render anything, it just syncs the cart
  useSyncCart()
  return null
}
