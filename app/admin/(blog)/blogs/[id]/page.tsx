import PrivateLayout from "@/components/layout/private/private-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import BlogPostForm from "../_components/blog-post-form"

interface Props {
  params: {
    id: string
  }
}

export default async function EditBlogPost({ params }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

  if (!post) {
    notFound()
  }

  return (
    <PrivateLayout
      parentBreadcrumb={{ title: "Blog Posts", href: "/admin/blogs" }}
      currentBreadcrumb="Edit Post"
      title="Edit Post"
    >
      <BlogPostForm post={post} />
    </PrivateLayout>
  )
}
