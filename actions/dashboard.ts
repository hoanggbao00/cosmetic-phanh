"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server"

export interface DashboardData {
  currentMonthRevenue: number
  lastMonthRevenue: number
  currentMonthOrders: number
  lastMonthOrders: number
  currentMonthProducts: number
  lastMonthProducts: number
  currentMonthReviews: number
  lastMonthReviews: number
  revenueByMonth: {
    month: string
    revenue: number
  }[]
  topCartProducts: {
    name: string
    quantity: number
  }[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient()
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

  // Get current month revenue and orders
  const { data: currentMonthData } = await supabase
    .from("orders")
    .select("id, total_amount")
    .gte("created_at", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)
    .lt("created_at", `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`)

  // Get last month revenue and orders
  const { data: lastMonthData } = await supabase
    .from("orders")
    .select("id, total_amount")
    .gte("created_at", `${lastMonthYear}-${String(lastMonth).padStart(2, "0")}-01`)
    .lt("created_at", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)

  // Get current month products sold
  const { data: currentMonthProducts } = await supabase
    .from("order_items")
    .select("quantity")
    .gte("created_at", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)
    .lt("created_at", `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`)

  // Get last month products sold
  const { data: lastMonthProducts } = await supabase
    .from("order_items")
    .select("quantity")
    .gte("created_at", `${lastMonthYear}-${String(lastMonth).padStart(2, "0")}-01`)
    .lt("created_at", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)

  // Get current month reviews
  const { data: currentMonthReviews } = await supabase
    .from("product_reviews")
    .select("id")
    .gte("created_at", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)
    .lt("created_at", `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`)

  // Get last month reviews
  const { data: lastMonthReviews } = await supabase
    .from("product_reviews")
    .select("id")
    .gte("created_at", `${lastMonthYear}-${String(lastMonth).padStart(2, "0")}-01`)
    .lt("created_at", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)

  // Get revenue by month for the last 6 months
  const { data: revenueByMonth } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .gte("created_at", `${currentYear}-${String(currentMonth - 5).padStart(2, "0")}-01`)
    .lt("created_at", `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`)
    .order("created_at", { ascending: true })

  // Get top products in cart
  const { data: topCartProducts } = await supabase
    .from("cart_items")
    .select(`
      quantity,
      products (
        name
      )
    `)
    .order("quantity", { ascending: false })
    .limit(5)

  // Process the data
  const currentMonthRevenue =
    currentMonthData?.reduce((sum, order) => sum + order.total_amount, 0) || 0
  const lastMonthRevenue = lastMonthData?.reduce((sum, order) => sum + order.total_amount, 0) || 0
  const currentMonthOrderCount = currentMonthData?.length || 0
  const lastMonthOrderCount = lastMonthData?.length || 0
  const currentMonthProductCount =
    currentMonthProducts?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const lastMonthProductCount =
    lastMonthProducts?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const currentMonthReviewCount = currentMonthReviews?.length || 0
  const lastMonthReviewCount = lastMonthReviews?.length || 0

  // Process revenue by month
  const processedRevenueByMonth =
    revenueByMonth?.reduce(
      (acc, order) => {
        const month = new Date(order.created_at).toLocaleString("default", { month: "short" })
        const existingMonth = acc.find((item) => item.month === month)
        if (existingMonth) {
          existingMonth.revenue += order.total_amount
        } else {
          acc.push({ month, revenue: order.total_amount })
        }
        return acc
      },
      [] as { month: string; revenue: number }[]
    ) || []

  // Process top cart products
  const processedTopCartProducts =
    topCartProducts?.map((item) => ({
      name: item.products?.[0]?.name,
      quantity: item.quantity,
    })) || []

  return {
    currentMonthRevenue,
    lastMonthRevenue,
    currentMonthOrders: currentMonthOrderCount,
    lastMonthOrders: lastMonthOrderCount,
    currentMonthProducts: currentMonthProductCount,
    lastMonthProducts: lastMonthProductCount,
    currentMonthReviews: currentMonthReviewCount,
    lastMonthReviews: lastMonthReviewCount,
    revenueByMonth: processedRevenueByMonth,
    topCartProducts: processedTopCartProducts,
  }
}
