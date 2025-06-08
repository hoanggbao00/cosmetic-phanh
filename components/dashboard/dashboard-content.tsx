"use client"

import { type DashboardData, getDashboardData } from "@/actions/dashboard"
import { useQuery } from "@tanstack/react-query"
import { DashboardCharts } from "./dashboard-charts"
import { OverviewCards } from "./overview-cards"
import { ReviewsTable } from "./reviews-table"

export function DashboardContent() {
  const { data: dashboardData } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
  })

  return (
    <div className="space-y-8">
      <OverviewCards data={dashboardData} />
      <DashboardCharts data={dashboardData} />
      <ReviewsTable />
    </div>
  )
}
