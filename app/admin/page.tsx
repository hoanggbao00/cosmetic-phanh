import { DashboardContent } from "@/components/dashboard/dashboard-content"
import PrivateLayout from "@/components/layout/private/private-layout"

export default function Dashboard() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Dashboard"
    >
      <DashboardContent />
    </PrivateLayout>
  )
}
