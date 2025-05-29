import PrivateLayout from "@/components/layout/private/private-layout"
import ProductTable from "./product-table"

export default function ProductPage() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Products"
      title="Products"
    >
      <ProductTable />
    </PrivateLayout>
  )
}
