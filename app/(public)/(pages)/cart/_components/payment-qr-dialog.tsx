"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/stores/cart-store"
import { useOrderStore } from "@/stores/order-store"
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
  const { clearCurrentOrder } = useOrderStore()

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

  const handleClose = () => {
    if (order?.payment_status === "paid") {
      clearCart()
      clearCurrentOrder()
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
          <DialogTitle>Thanh toán đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground text-sm">Mã đơn hàng: {orderId}</p>
            {isPaid && (
              <div className="flex flex-col items-center justify-center gap-2 py-4 text-green-600">
                <CheckCircleIcon size={48} />
                <p className="font-semibold text-lg">Đã thanh toán thành công</p>
                <p className="font-semibold text-black text-lg">Số tiền: {formatPrice(amount)}</p>
                <p className="text-muted-foreground text-sm">
                  Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi
                  <br />
                  Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi
                  <br />
                  <a href="tel:0909090909" className="text-blue-500">
                    0909090909
                  </a>
                </p>
              </div>
            )}
            {!isPaid && (
              <>
                <p className="font-semibold text-lg">Số tiền: {formatPrice(amount)}</p>
                <p className="font-medium text-green-600">Đã tạo đơn hàng thành công</p>
                <p className="text-muted-foreground text-sm">
                  Nhấn nút bên dưới để tiến hành thanh toán qua VNPay
                </p>
              </>
            )}
          </div>

          {isLoading ? (
            <p>Đang tạo liên kết thanh toán...</p>
          ) : isPaid ? (
            <Button variant="outline" className="w-full" onClick={handleClose}>
              Đóng
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full" disabled={!paymentUrl}>
                  Thanh toán
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
                    Đang kiểm tra
                  </>
                ) : (
                  "Kiểm tra thanh toán"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
