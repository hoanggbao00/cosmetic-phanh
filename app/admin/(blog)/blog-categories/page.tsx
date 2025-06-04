import PrivateLayout from "@/components/layout/private/private-layout"
import BlogCategoriesTable from "./blog-categories-table"

export default function BlogCategories() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Blog Categories"
      title="Blog Categories"
    >
      <BlogCategoriesTable />
    </PrivateLayout>
  )
} 