"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCreateOrder } from "@/queries/orders"
import { useValidateVoucher } from "@/queries/voucher"
import { useCartStore } from "@/stores/cart-store"
import type { OrderInsert } from "@/types/tables/orders"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import OrderForm from "./order-form"

interface CartSummaryProps {
  subtotal: number
  userId?: string
}

export default function CartSummary({ subtotal, userId }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [voucherId, setVoucherId] = useState<string | null>(null)

  const { clearCart } = useCartStore()

  // Calculate order values
  const shipping = subtotal > 100 ? 0 : 0
  const total = subtotal + shipping - discount

  const validateVoucher = useValidateVoucher()
  const createOrder = useCreateOrder()

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
      const order: OrderInsert = {
        user_id: userId,
        guest_email: userId ? undefined : orderData.guest_email,
        status: "pending",
        payment_status: "pending",
        payment_method: orderData.payment_method,
        shipping_amount: shipping,
        discount_amount: discount,
        total_amount: total,
        shipping_address: {
          full_name: orderData.shipping_address.full_name,
          address_line1: orderData.shipping_address.address_line1,
          address_line2: orderData.shipping_address.address_line2,
          city: orderData.shipping_address.city,
          phone: orderData.shipping_address.phone,
        },
        voucher_id: voucherId,
        voucher_code: promoCode,
        order_items: cartItems.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
          product_name: item.name,
          variant_name: item.variantName,
          total_price: item.quantity * item.price,
        })),
      }

      const result = await createOrder.mutateAsync(order)

      if (result) {
        if (orderData.payment_method === "bank_transfer") {
          toast.success("Order placed successfully! Please complete your payment.", {
            description: "Scan the QR code to complete your payment.",
          })
        } else {
          clearCart()
          toast.success("Order placed successfully!", {
            description: "We will process your cash on delivery order shortly.",
          })
        }
      }

      return { orderId: result.id, total }
    } catch (error) {
      console.error("Failed to create order:", error)
      toast.error("Failed to create order. Please try again.")
    }
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    try {
      const voucher = await validateVoucher.mutateAsync({
        code: promoCode.trim(),
        userId,
      })

      if (voucher) {
        // Calculate discount based on voucher type and value
        let discountAmount = 0
        if (voucher.type === "percentage") {
          discountAmount = (subtotal * voucher.value) / 100
          if (voucher.maximum_discount_amount && discountAmount > voucher.maximum_discount_amount) {
            discountAmount = voucher.maximum_discount_amount
          }
        } else {
          discountAmount = voucher.value
        }

        // Check minimum order amount
        if (voucher.minimum_order_amount && subtotal < voucher.minimum_order_amount) {
          throw new Error(
            `Minimum order amount for this voucher is ${formatPrice(voucher.minimum_order_amount)}`
          )
        }

        setDiscount(discountAmount)
        setVoucherId(voucher.id)
        setPromoError(null)
        toast.success(`Promo code "${promoCode}" applied!`)
      }
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

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping > 0 ? formatPrice(shipping) : "Free"}</span>
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
      <Button className="w-full" size="lg" onClick={handleCheckout}>
        Proceed to Checkout
      </Button>
    </div>
  )
}
