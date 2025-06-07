import PageLayout from "@/components/layout/(public)/page-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import BlogDetailView from "./_components/blog-detail"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params

  const supabase = await createSupabaseServerClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:blog_categories(
        id,
        name
      ),
      author:profiles(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-6xl px-4 md:px-0">
      <BlogDetailView post={post} />
    </PageLayout>
  )
}
