"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code to Pay</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="h-64 w-64 rounded-lg border bg-white p-4">
            {/* QR Code will be an image from your payment provider */}
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              QR Code Here
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground text-sm">Order ID: {orderId}</p>
            <p className="font-semibold text-lg">Amount: ${amount.toFixed(2)}</p>
            <p className="text-muted-foreground text-sm">
              Please scan the QR code to complete your payment
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
