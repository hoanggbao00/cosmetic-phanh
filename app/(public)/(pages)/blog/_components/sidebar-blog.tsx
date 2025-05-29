"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { allCategories, blogPosts } from "@/lib/data-blog"
import { format } from "date-fns"
import { SearchIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounceCallback } from "usehooks-ts"

export default function SidebarBlog() {
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

  const handleChangeCategory = useDebounceCallback((category: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    router.replace(`/blog?${params.toString()}`)
  }, 300)

  // Get recent posts (5 most recent)
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
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

          {allCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="mr-2 mb-2"
              onClick={() => handleChangeCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="mb-4 font-medium text-lg">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="flex items-start space-x-3">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div>
                <Link
                  href={`/blog/${post.id}`}
                  className="line-clamp-2 font-medium text-sm hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-muted-foreground text-xs">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
