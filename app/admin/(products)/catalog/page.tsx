import PrivateLayout from "@/components/layout/private/private-layout"
import {} from "@/components/ui/sheet"
import CatalogTable from "./catalog-table"

export default function ProductCatalog() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Product Catalog"
      title="Product Catalog"
    >
      <CatalogTable />
    </PrivateLayout>
  )
}
