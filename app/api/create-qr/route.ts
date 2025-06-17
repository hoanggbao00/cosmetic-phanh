import { type NextRequest, NextResponse } from "next/server"
import { HashAlgorithm, ProductCode, VNPay, VnpLocale } from "vnpay"

const vnp_TmnCode = process.env.NEXT_PUBLIC_VNP_TMN_CODE
const vnp_HashSecret = process.env.NEXT_PUBLIC_VNP_HASH_SECRET

const returnUrl = process.env.VERCEL_URL
  ? `${process.env.VERCEL_URL}/api/check-banking`
  : "http://localhost:3000/api/check-banking"

export async function POST(request: NextRequest) {
  if (!vnp_TmnCode || !vnp_HashSecret) {
    return NextResponse.json({ error: "Missing VNPay environment variables" }, { status: 500 })
  }

  const { orderId, amount } = await request.json()

  if (!orderId || !amount) {
    return NextResponse.json({ error: "Missing orderId or amount" }, { status: 400 })
  }

  const vnpay = new VNPay({
    tmnCode: vnp_TmnCode,
    secureSecret: vnp_HashSecret,
    vnpayHost: "https://sandbox.vnpayment.vn",
    hashAlgorithm: HashAlgorithm.SHA512,
    testMode: true,
  })

  const vnPayResponse = await vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: "127.0.0.1",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Order ${orderId}`,
    vnp_OrderType: ProductCode.Other,
    vnp_Locale: VnpLocale.VN,
    vnp_ReturnUrl: returnUrl,
  })

  return NextResponse.json(vnPayResponse)
}
