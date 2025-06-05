"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { blogPosts } from "@/lib/data-blog"
import type { BlogPost } from "@/types/tables"
import type { BlogCategory } from "@/types/tables/blog_categories"
import { Menu } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { FeaturedPost } from "./featured-post"
import { ListPost } from "./list-post"
import { EmptyPost } from "./list-post/empty-post"
import SidebarBlog from "./sidebar-blog"

interface BlogListPageProps {
  categories: BlogCategory[]
  featuredPosts: BlogPost[]
  recentPosts: BlogPost[]
}

export default function BlogListPage({
  categories,
  featuredPosts,
  recentPosts,
}: BlogListPageProps) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const selectedCategoryId = searchParams.get("category") || ""

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const title = selectedCategory
    ? `${selectedCategory.name} Posts`
    : searchQuery
      ? "Search Results"
      : "Our Blog"

  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filter posts based on search query and selected category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategoryId ? post.category_id === selectedCategoryId : true

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-4xl">{title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Discover the latest beauty trends, skincare tips, and product reviews from our experts.
        </p>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="mb-6 md:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex w-full items-center justify-between"
            >
              <span>Blog Options</span>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-4">
            <SheetHeader className="mb-4">
              <SheetTitle>Blog Options</SheetTitle>
            </SheetHeader>
            <SidebarBlog categories={categories} recentPosts={recentPosts} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Blog Posts */}
        <div className="lg:w-2/3">
          {!selectedCategoryId && !searchQuery && <FeaturedPost featuredPosts={featuredPosts} />}

          {/* All Posts or Filtered Posts */}
          <div>
            <h2 className="mb-6 font-bold text-2xl">
              {selectedCategory
                ? `${selectedCategory.name} Posts`
                : searchQuery
                  ? "Search Results"
                  : "All Posts"}
            </h2>

            {filteredPosts.length > 0 ? (
              <ListPost searchQuery={searchQuery} selectedCategory={selectedCategoryId} />
            ) : (
              <EmptyPost searchQuery={searchQuery} selectedCategory={selectedCategoryId} />
            )}
          </div>
        </div>

        {/* Sidebar - Desktop */}
        <div className="sticky top-52 hidden space-y-8 lg:block lg:w-1/3">
          <SidebarBlog categories={categories} recentPosts={recentPosts} />
        </div>
      </div>
    </div>
  )
}
