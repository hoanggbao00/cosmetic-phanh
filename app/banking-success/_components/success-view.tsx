"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { CheckCircle2Icon, PhoneIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface SuccessViewProps {
  ordersLink: string
}

export default function SuccessView({ ordersLink }: SuccessViewProps) {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const amount = searchParams.get("amount")

  return (
    <div className="container mx-auto min-h-screen max-w-lg px-4 py-8 pt-28">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle2Icon className="h-6 w-6" />
            Payment successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground text-sm">Order ID: {orderId}</p>
            <p className="font-semibold text-lg">Amount: {formatPrice(Number(amount))}</p>
            <p className="text-muted-foreground text-sm">Order has been paid successfully</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <PhoneIcon className="h-4 w-4" />
              <span>If you have any questions, please contact us: 0123456789</span>
            </div>

            <Button asChild>
              <Link href={ordersLink}>Check order history</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
