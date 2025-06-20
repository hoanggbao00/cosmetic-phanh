import PrivateLayout from "@/components/layout/private/private-layout"
import BlogPostsTable from "./blog-posts-table"

export default function BlogPosts() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Admin", href: "/admin" }}
      currentBreadcrumb="Blog Posts"
      title="Blog Posts"
    >
      <BlogPostsTable />
    </PrivateLayout>
  )
} 