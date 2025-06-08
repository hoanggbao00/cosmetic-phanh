"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCreateOrderMutation } from "@/queries/orders"
import { useValidateVoucher } from "@/queries/voucher"
import { useCartStore } from "@/stores/cart-store"
import type { OrderInsert } from "@/types/tables/orders"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import OrderForm from "./order-form"
import PaymentQRDialog from "./payment-qr-dialog"

interface CartSummaryProps {
  subtotal: number
  userId?: string
}

export default function CartSummary({ subtotal, userId }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [orderAmount, setOrderAmount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [voucherId, setVoucherId] = useState<string | null>(null)

  const { clearCart } = useCartStore()

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
    if (orderId) {
      setOrderAmount(total)
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

  const handleOrderSubmit = async (
    orderData: OrderInsert,
    cartItems: {
      productId: string
      name: string
      variantId?: string
      variantName?: string
      price: number
      quantity: number
    }[]
  ) => {
    try {
      await createOrder.mutateAsync({
        formData: {
          full_name: orderData.shipping_address.full_name,
          email: userId ? undefined : orderData.guest_email || "",
          phone: orderData.shipping_address.phone || "",
          address_line1: orderData.shipping_address.address_line1,
          address_line2: orderData.shipping_address.address_line2,
          city: orderData.shipping_address.city,
          payment_method: orderData.payment_method as "cash" | "bank_transfer",
        },
        cartItems: cartItems.map((item) => ({
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
        userId,
      })

      const orderId = currentOrderId || ""
      return { orderId, total }
    } catch (error) {
      console.error("Failed to create order:", error)
      toast.error("Failed to create order. Please try again.")
    }
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    try {
      const result = await validateVoucher.mutateAsync({
        code: promoCode.trim(),
        subtotal,
      })
      setVoucherId(result.voucherId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to apply voucher"
      setPromoError(errorMessage)
      setDiscount(0)
      setVoucherId(null)
      toast.error(errorMessage)
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
        {currentOrderId && (
          <PaymentQRDialog
            isOpen={showQRDialog}
            onClose={() => setShowQRDialog(false)}
            orderId={currentOrderId}
            amount={orderAmount}
          />
        )}
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
    </div>
  )
}
