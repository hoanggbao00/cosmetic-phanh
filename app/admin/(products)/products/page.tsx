import PrivateLayout from "@/components/layout/private/private-layout"

export default function ProductsPage() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Products"
    >
      <div>Products</div>
    </PrivateLayout>
  )
}
