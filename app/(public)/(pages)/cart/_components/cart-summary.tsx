"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCreateOrderMutation } from "@/queries/orders"
import { useValidateVoucher } from "@/queries/voucher"
import { useCartStore } from "@/stores/cart-store"
import { useOrderStore } from "@/stores/order-store"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import OrderForm, { type FormValues } from "./order-form"
import PaymentQRDialog from "./payment-qr-dialog"

interface CartSummaryProps {
  subtotal: number
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [lastSubmittedData, setLastSubmittedData] = useState<FormValues | null>(null)
  const [discount, setDiscount] = useState(0)
  const [voucherId, setVoucherId] = useState<string | null>(null)

  const { items, clearCart } = useCartStore()
  const { setCurrentOrderId } = useOrderStore()

  // Calculate order values
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping - discount

  const validateVoucher = useValidateVoucher((discount) => {
    setDiscount(discount)
    setPromoError(null)
    toast.success(`Promo code "${promoCode}" applied!`)
  })

  const createOrder = useCreateOrderMutation((orderId) => {
    setCurrentOrderId(orderId)
    if (lastSubmittedData?.payment_method === "bank_transfer") {
      setShowQRDialog(true)
      toast.success("Order placed successfully! Please complete your payment.", {
        description: "Scan the QR code to complete your payment.",
      })
    } else {
      clearCart()
      toast.success("Order placed successfully!", {
        description: "We will process your cash on delivery order shortly.",
      })
    }
  })

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    try {
      const result = await validateVoucher.mutateAsync({
        code: promoCode.trim().toUpperCase(),
        subtotal,
      })
      setVoucherId(result.voucherId)
    } catch (error) {
      setPromoError((error as Error).message)
      setDiscount(0)
      setVoucherId(null)
    }
  }

  const handleCheckout = () => {
    setShowOrderForm(true)
  }

  const handleBack = () => {
    setShowOrderForm(false)
    setPromoCode("")
    setPromoError(null)
    setDiscount(0)
    setVoucherId(null)
  }

  const handleOrderSubmit = async (formData: FormValues) => {
    setLastSubmittedData(formData)
    try {
      await createOrder.mutateAsync({
        formData: {
          ...formData,
          address: formData.address_line1,
        },
        cartItems: items.map((item) => ({
          product: {
            id: item.productId,
            price: item.price,
          },
          quantity: item.quantity,
          variant: item.variantId ? { id: item.variantId } : null,
        })),
        subtotal,
        shipping,
        discount_amount: discount,
        total,
        voucher_id: voucherId,
        voucher_code: promoCode,
      })
    } catch (error) {
      console.error("Failed to create order:", error)
      toast.error("Failed to create order. Please try again.")
    }
  }

  if (showOrderForm) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <OrderForm onSubmit={handleOrderSubmit} isLoading={createOrder.isPending} />
        </div>
        <PaymentQRDialog
          isOpen={showQRDialog}
          onClose={() => setShowQRDialog(false)}
          amount={total}
          orderId={useOrderStore.getState().currentOrderId || ""}
        />
      </div>
    )
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
            disabled={validateVoucher.isPending}
          />
          <Button
            variant="outline"
            onClick={handleApplyPromo}
            disabled={validateVoucher.isPending || !promoCode.trim()}
          >
            {validateVoucher.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
        {promoError && <p className="mt-2 text-red-500 text-sm">{promoError}</p>}
      </div>

      <Separator className="my-4" />

      {/* Order Details */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="mb-6 flex items-center justify-between">
        <span className="font-medium text-base">Total</span>
        <span className="font-bold text-xl">{formatPrice(total)}</span>
      </div>

      {/* Checkout Button */}
      <Button className="w-full" size="lg" onClick={handleCheckout} disabled={subtotal === 0}>
        Proceed to Checkout
      </Button>

      {/* Shipping Note */}
      {subtotal < 100 && (
        <p className="mt-4 text-center text-muted-foreground text-xs">
          Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping
        </p>
      )}
    </div>
  )
}
