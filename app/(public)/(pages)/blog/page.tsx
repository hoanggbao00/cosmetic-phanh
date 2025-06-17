import PageLayout from "@/components/layout/(public)/page-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import BlogListPage from "./_components/blog-page-view"

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient()

  // Fetch blog categories
  const { data: blogCategories } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name", { ascending: true })

  // Fetch featured posts (limit 2)
  const { data: featuredPosts } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories(
        id,
        name
      ),
      authors:profiles(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(2)

  // Fetch recent posts (limit 5)
  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories(
        id,
        name
      ),
      authors:profiles(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 md:px-0">
      <BlogListPage
        categories={blogCategories || []}
        featuredPosts={featuredPosts || []}
        recentPosts={recentPosts || []}
      />
    </PageLayout>
  )
}
