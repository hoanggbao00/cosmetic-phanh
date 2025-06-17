"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/stores/cart-store"
import { useQuery } from "@tanstack/react-query"
import { CheckCircleIcon, Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { checkOrderPaymentStatus } from "../actions"

interface PaymentQRDialogProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  amount: number
}

export default function PaymentQRDialog({
  isOpen,
  onClose,
  orderId,
  amount,
}: PaymentQRDialogProps) {
  const [paymentUrl, setPaymentUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)

  // Query to check payment status using server action
  const { data: order, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => checkOrderPaymentStatus(orderId),
    enabled: false, // Disable automatic fetching
  })

  useEffect(() => {
    const createPaymentUrl = async () => {
      if (!isOpen) return

      setIsLoading(true)
      try {
        const response = await fetch("/api/create-qr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            amount,
          }),
        })
        const data = await response.json()
        setPaymentUrl(data)
      } catch (error) {
        console.error("Failed to create payment URL:", error)
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentUrl()
  }, [isOpen, orderId, amount])

  const handleClose = async () => {
    if (order?.payment_status === "paid") {
      await clearCart()
      router.push("/orders")
    }
    onClose()
  }

  const handleCheckPayment = async () => {
    setIsChecking(true)
    await refetch()
    setIsChecking(false)
  }

  const isPaid = order?.payment_status === "paid"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground text-sm">Order ID: {orderId}</p>
            {isPaid && (
              <div className="flex flex-col items-center justify-center gap-2 py-4 text-green-600">
                <CheckCircleIcon size={48} />
                <p className="font-semibold text-lg">Successfully paid</p>
                <p className="font-semibold text-black text-lg">Amount: {formatPrice(amount)}</p>
                <p className="text-muted-foreground text-sm">
                  Thank you for trusting and using our services
                  <br />
                  If you have any questions, please contact us
                  <br />
                  <a href="tel:0909090909" className="text-blue-500">
                    0909090909
                  </a>
                </p>
              </div>
            )}
            {!isPaid && (
              <>
                <p className="font-semibold text-lg">Amount: {formatPrice(amount)}</p>
                <p className="font-medium text-green-600">Successfully created order</p>
                <p className="text-muted-foreground text-sm">
                  Click the button below to proceed with payment via VNPay
                </p>
              </>
            )}
          </div>

          {isLoading ? (
            <p>Creating payment link...</p>
          ) : isPaid ? (
            <Button variant="outline" className="w-full" onClick={handleClose}>
              Close
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full" disabled={!paymentUrl}>
                  Go to payment
                </Button>
              </a>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCheckPayment}
                disabled={isChecking}
              >
                {isChecking ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Checking payment
                  </>
                ) : (
                  "Check payment"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
