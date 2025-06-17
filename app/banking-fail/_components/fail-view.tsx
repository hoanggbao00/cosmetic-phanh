"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface FailViewProps {
  ordersLink: string
}

export default function FailView({ ordersLink }: FailViewProps) {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const amount = Number.parseFloat(searchParams.get("amount") || "0")

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="rounded-full bg-red-100 p-4">
        <svg
          className="h-12 w-12 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h1 className="font-bold text-3xl">Payment failed</h1>
      <div className="space-y-2 text-gray-600">
        <p>Order ID: {orderId}</p>
        <p>Amount: {formatPrice(amount)}</p>
        <p className="mt-4 font-medium">Please contact us to proceed with refund: 09090909</p>
      </div>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href={ordersLink}>Check order</Link>
        </Button>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
