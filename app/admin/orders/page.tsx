import PrivateLayout from "@/components/layout/private/private-layout"
import OrdersTable from "./orders-table"

export default function OrdersPage() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Orders", href: "/admin/orders" }}
      currentBreadcrumb="Orders"
      title="Orders"
    >
      <OrdersTable />
    </PrivateLayout>
  )
}
