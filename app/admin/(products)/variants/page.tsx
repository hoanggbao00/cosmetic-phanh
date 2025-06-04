import type { Metadata } from "next"

import PrivateLayout from "@/components/layout/private/private-layout"
import ProductVariantsTable from "./product-variants-table"

export const metadata: Metadata = {
  title: "Product Variants",
  description: "Manage product variants",
}

export default function ProductVariantsPage() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Product Variants"
      title="Product Variants"
    >
      <ProductVariantsTable />
    </PrivateLayout>
  )
}
