"use client"

import { formatDate } from "@/lib/utils"
import { useLatestBlogPosts } from "@/queries/blog"
import Link from "next/link"

export default function RelatedPost() {
  const { data: posts } = useLatestBlogPosts()

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <div key={post.id} className="group flex gap-3">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="object-cover transition-all duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <Link
              href={`/blog/${post.slug}`}
              className="line-clamp-2 font-medium text-sm transition-all duration-300 group-hover:text-primary"
            >
              {post.title}
            </Link>
            <div className="mt-1 text-muted-foreground text-xs">
              {formatDate(post.created_at)} • Admin
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
