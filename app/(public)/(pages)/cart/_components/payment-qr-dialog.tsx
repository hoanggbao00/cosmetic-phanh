import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PaymentQRDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  orderId: string
}

export default function PaymentQRDialog({
  open,
  onOpenChange,
  amount,
  orderId,
}: PaymentQRDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code to Pay</DialogTitle>
          <DialogDescription>
            Please scan this QR code with your banking app to complete the payment of $
            {amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-6">QR Code hiện ở đây</div>
        <p className="text-center text-muted-foreground text-sm">Order ID: {orderId}</p>
      </DialogContent>
    </Dialog>
  )
}
