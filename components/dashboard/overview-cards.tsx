import type { DashboardData } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { DollarSign, Package, ShoppingCart, Star } from "lucide-react"
import { useMemo } from "react"

interface OverviewCardsProps {
  data: DashboardData | undefined
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const thisMonthRevenue = useMemo(() => {
    if (!data?.totalRevenue) return 0
    return data.totalRevenue - data.lastMonthRevenue
  }, [data])

  const thisMonthProducts = useMemo(() => {
    if (!data?.currentMonthProducts) return 0
    return data.currentMonthProducts - data.lastMonthProducts
  }, [data])

  const thisMonthOrders = useMemo(() => {
    if (!data?.currentMonthOrders) return 0
    return data.currentMonthOrders - data.lastMonthOrders
  }, [data])

  const thisMonthReviews = useMemo(() => {
    if (!data?.currentMonthReviews) return 0
    return data.currentMonthReviews - data.lastMonthReviews
  }, [data])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">${formatPrice(data?.totalRevenue || 0)}</div>
          <p className="text-muted-foreground text-xs">
            +${formatPrice(thisMonthRevenue)} vs last month
          </p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium text-sm">Products Sold</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">+{thisMonthProducts || 0}</div>
          <p className="text-muted-foreground text-xs">
            {(
              ((data?.currentMonthProducts || 0) / (data?.lastMonthProducts || 1)) * 100 -
              100
            ).toFixed(1)}
            % vs last month
          </p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium text-sm">New Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">+{thisMonthOrders || 0}</div>
          <p className="text-muted-foreground text-xs">+{thisMonthOrders} this month</p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium text-sm">New Reviews</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">+{thisMonthReviews || 0}</div>
          <p className="text-muted-foreground text-xs">+{data?.currentMonthReviews} this month</p>
        </CardContent>
      </Card>
    </div>
  )
}
