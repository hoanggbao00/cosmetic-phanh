import PrivateLayout from "@/components/layout/private/private-layout"
import BlogPostForm from "../_components/blog-post-form"

export default function NewBlogPost() {
  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Blog Posts", href: "/admin/blogs" }}
      currentBreadcrumb="New Post"
      title="New Post"
      className="mx-auto w-full max-w-7xl"
    >
      <BlogPostForm />
    </PrivateLayout>
  )
}
