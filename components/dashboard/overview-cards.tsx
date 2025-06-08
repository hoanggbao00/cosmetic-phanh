import type { DashboardData } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { DollarSign, Package, ShoppingCart, Star } from "lucide-react"

interface OverviewCardsProps {
  data: DashboardData | undefined
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const thisMonthRevenue = formatPrice(
    ((data?.currentMonthRevenue || 0) / (data?.lastMonthRevenue || 1)) * 100 - 100 || 0
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium text-sm">Doanh thu tháng này</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{formatPrice(data?.currentMonthRevenue || 0)}</div>
          <p className="text-muted-foreground text-xs">{thisMonthRevenue}% so với tháng trước</p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium text-sm">Sản phẩm đã bán</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">+{data?.currentMonthProducts || 0}</div>
          <p className="text-muted-foreground text-xs">
            {(
              ((data?.currentMonthProducts || 0) / (data?.lastMonthProducts || 1)) * 100 -
              100
            ).toFixed(1)}
            % so với tháng trước
          </p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium text-sm">Đơn hàng mới</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">+{data?.currentMonthOrders || 0}</div>
          <p className="text-muted-foreground text-xs">
            {(((data?.currentMonthOrders || 0) / (data?.lastMonthOrders || 1)) * 100 - 100).toFixed(
              1
            )}
            % so với tháng trước
          </p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium text-sm">Đánh giá mới</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">+{data?.currentMonthReviews || 0}</div>
          <p className="text-muted-foreground text-xs">
            {(
              ((data?.currentMonthReviews || 0) / (data?.lastMonthReviews || 1)) * 100 -
              100
            ).toFixed(1)}
            % so với tháng trước
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
