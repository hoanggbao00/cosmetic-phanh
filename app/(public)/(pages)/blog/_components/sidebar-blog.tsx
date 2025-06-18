"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BlogPost } from "@/types/tables"
import type { BlogCategory } from "@/types/tables/blog_categories"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounceCallback } from "usehooks-ts"

interface SidebarBlogProps {
  categories: BlogCategory[]
  recentPosts: BlogPost[]
}

export default function SidebarBlog({ categories, recentPosts }: SidebarBlogProps) {
  const searchParams = useSearchParams()
  const defaultQuery = searchParams.get("query") || ""
  const selectedCategory = searchParams.get("category") || null

  const router = useRouter()

  const handleSearch = useDebounceCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("query", value)
    } else {
      params.delete("query")
    }

    router.replace(`/blog?${params.toString()}`)
  }, 300)

  const handleChangeCategory = useDebounceCallback((categoryId: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (categoryId) {
      params.set("category", categoryId)
    } else {
      params.delete("category")
    }

    router.replace(`/blog?${params.toString()}`)
  }, 300)

  return (
    <div className="max-h-[calc(100vh-10rem)] space-y-4 overflow-y-auto lg:space-y-8">
      {/* Search */}
      <div>
        <h3 className="mb-4 font-medium text-lg">Search</h3>
        <Input
          type="search"
          placeholder="Search articles..."
          className="pl-8"
          defaultValue={defaultQuery}
          onChange={handleSearch}
          startIcon={SearchIcon}
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-4 font-medium text-lg">Categories</h3>
        <div className="space-y-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="mr-2 mb-2"
            onClick={() => handleChangeCategory(null)}
          >
            All
          </Button>

          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="mr-2 mb-2"
              onClick={() => handleChangeCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="mb-4 font-medium text-lg">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts?.map((post) => (
            <div key={post.id} className="flex items-start space-x-3">
              <img
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="line-clamp-2 font-medium text-sm hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-muted-foreground text-xs">
                  {post.created_at}
                  {/* {format(new Date(post.created_at), "MMMM d, yyyy")} */}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
