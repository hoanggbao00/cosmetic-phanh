import { createSupabaseServerClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("vnp_OrderInfo")?.split("Order ")[1]
    const amount = Number(searchParams.get("vnp_Amount")) / 100
    const responseCode = searchParams.get("vnp_ResponseCode")

    if (!orderId || !amount || responseCode !== "00") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment data",
        },
        { status: 400 }
      )
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

    // Verify amount matches
    if (order.total_amount !== amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount mismatch",
        },
        { status: 400 }
      )
    }

    // Update payment status to paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", orderId)

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update order",
        },
        { status: 500 }
      )
    }

    // Redirect to success page with order details
    const redirectUrl = new URL("/banking-success", request.url)
    redirectUrl.searchParams.set("orderId", orderId)
    redirectUrl.searchParams.set("amount", amount.toString())

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}
