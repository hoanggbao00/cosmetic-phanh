import PageLayout from "@/components/layout/(public)/page-layout"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import ProductDetail from "./_components/product-detail"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      brand:brands(
        id,
        name,
        logo_url
      ),
      category:categories(
        id,
        name
      ),
      reviews:product_reviews(
        id,
        rating,
        comment,
        created_at,
        user:profiles!product_reviews_user_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        admin_reply,
        admin_reply_at,
        admin_reply_by
      ),
      variants:product_variants(*)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <PageLayout className="min-h-screen">
      <ProductDetail product={product} />
    </PageLayout>
  )
}
