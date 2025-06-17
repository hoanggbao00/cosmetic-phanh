import { getStoreConfig } from "@/actions/store-config"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("vnp_OrderInfo")?.split("Order ")[1]
    const amount = Number(searchParams.get("vnp_Amount")) / 100
    const responseCode = searchParams.get("vnp_ResponseCode")

    if (!orderId || !amount || responseCode !== "00") {
      // Redirect to fail page with error details
      const redirectUrl = new URL("/banking-fail", request.url)
      redirectUrl.searchParams.set("orderId", orderId || "N/A")
      redirectUrl.searchParams.set("amount", amount?.toString() || "0")
      return NextResponse.redirect(redirectUrl)
    }

    const storeConfig = await getStoreConfig()
    let dollarRatio = 1

    if (storeConfig) {
      dollarRatio = storeConfig.dollar_ratio
    }

    const supabase = await createSupabaseServerClient()

    // Find and update the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, payment_status, total_amount")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      )
    }

    const amountInUSD = amount / dollarRatio

    // Verify amount matches
    if (order.total_amount !== amountInUSD) {
      // Redirect to fail page with amount mismatch
      const redirectUrl = new URL("/banking-fail", request.url)
      redirectUrl.searchParams.set("orderId", orderId)
      redirectUrl.searchParams.set("amount", amountInUSD.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // Update payment status to paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", orderId)

    if (updateError) {
      // Redirect to fail page with update error
      const redirectUrl = new URL("/banking-fail", request.url)
      redirectUrl.searchParams.set("orderId", orderId)
      redirectUrl.searchParams.set("amount", amountInUSD.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect to success page with order details
    const redirectUrl = new URL("/banking-success", request.url)
    redirectUrl.searchParams.set("orderId", orderId)
    redirectUrl.searchParams.set("amount", amountInUSD.toString())

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Payment verification error:", error)
    const redirectUrl = new URL("/banking-fail", request.url)
    redirectUrl.searchParams.set("orderId", "N/A")
    redirectUrl.searchParams.set("amount", "0")
    return NextResponse.redirect(redirectUrl)
  }
}
