import type { DashboardData } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { BarChart, LineChart } from "@tremor/react"

interface DashboardChartsProps {
  data: DashboardData | undefined
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <LineChart
              className="h-[300px]"
              data={data?.revenueByMonth || []}
              index="month"
              categories={["revenue"]}
              colors={["indigo"]}
              valueFormatter={(value: number) => formatPrice(value)}
              yAxisWidth={80}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top products in cart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <BarChart
              className="h-[300px]"
              data={data?.topCartProducts || []}
              index="name"
              categories={["quantity"]}
              colors={["blue", "cyan", "violet"]}
              valueFormatter={(value: number) => `${value} products`}
              yAxisWidth={48}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
