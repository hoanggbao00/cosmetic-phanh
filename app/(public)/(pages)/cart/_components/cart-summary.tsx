"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/stores/cart-store"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface CartSummaryProps {
  subtotal: number
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)

  // Calculate order values
  const shipping = subtotal > 100 ? 0 : 10
  const discount = 0
  const total = subtotal + shipping - discount

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)

    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false)
      toast.success(`Promo code "${promoCode}" applied!`)
    }, 1000)
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)

    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setIsCheckingOut(false)
      alert("Order placed successfully!")
      router.push("/")
    }, 1500)
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-medium text-lg">Order Summary</h2>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleApplyPromo}
            disabled={isApplyingPromo || !promoCode.trim()}
          >
            {isApplyingPromo ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Order Details */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Discount</span>
          <span>${discount.toFixed(2)}</span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="mb-6 flex items-center justify-between">
        <span className="font-medium text-base">Total</span>
        <span className="font-bold text-xl">${total.toFixed(2)}</span>
      </div>

      {/* Checkout Button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleCheckout}
        disabled={isCheckingOut || subtotal === 0}
      >
        {isCheckingOut ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Proceed to Checkout"
        )}
      </Button>

      {/* Shipping Note */}
      {subtotal < 100 && (
        <p className="mt-4 text-center text-muted-foreground text-xs">
          Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping
        </p>
      )}

      {/* Secure Checkout Message */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-xs">Secure checkout powered by Stripe</p>
      </div>
    </div>
  )
}
