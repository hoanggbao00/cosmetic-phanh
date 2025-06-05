import type { Category } from "@/types/tables/categories"
import type { Product } from "@/types/tables/products"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import SectionBlogs from "./_components/section-blogs"
import { SectionCategory } from "./_components/section-category"
import { SectionCollections } from "./_components/section-collections"
import SectionFeedback from "./_components/section-feedback"
import { SectionHome } from "./_components/section-home"

interface CategoryWithCount extends Category {
  products: { count: number }[]
}

export default async function Home() {
  const supabase = await createSupabaseServerClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6)

  // Fetch categories with product count
  const { data: categoriesWithCount } = await supabase.from("categories").select(`
      id,
      name,
      slug,
      description,
      image_url,
      parent_id,
      is_active,
      created_at,
      updated_at,
      products:products(count)
    `)

  // Find category with most products
  let popularCategory: CategoryWithCount | null = null
  let maxCount = 0

  if (categoriesWithCount) {
    for (const category of categoriesWithCount as CategoryWithCount[]) {
      const count = category.products[0]?.count || 0
      if (count > maxCount) {
        maxCount = count
        popularCategory = category
      }
    }
  }

  // Fetch products for the most popular category
  const { data: popularCategoryProducts } = popularCategory
    ? await supabase
        .from("products")
        .select("*, categories(*)")
        .eq("category_id", popularCategory.id)
        .limit(6)
    : { data: null }

  return (
    <div className="min-h-screen space-y-6 bg-white">
      <SectionHome />
      <SectionCategory />
      <SectionCollections
        title="Trendy Collections"
        subTitle="Featured Products"
        products={(featuredProducts as Product[]) || []}
      />
      <SectionCollections
        title={`Shop ${popularCategory?.name || "Collections"}`}
        subTitle={`Our Most Popular ${popularCategory?.name || "Products"}`}
        products={(popularCategoryProducts as Product[]) || []}
      />
      <SectionBlogs />
      <SectionFeedback />
    </div>
  )
}
