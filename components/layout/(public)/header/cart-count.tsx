"use client"

import { useCartStore } from "@/stores/cart-store"
import { ShoppingBagIcon } from "lucide-react"
import Link from "next/link"

export const CartCount = () => {
  const { items } = useCartStore()

  return (
    <Link
      href="/cart"
      prefetch={false}
      className="relative transition-colors duration-300 hover:text-primary"
    >
      <ShoppingBagIcon className="size-4 md:size-6" />
      <span className="-right-2 -top-2 absolute flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-xs">
        {items.length}
      </span>
    </Link>
  )
}
