"use client"

import type { BlogPost } from "@/types/tables"
import Link from "next/link"

interface FeaturedPostProps {
  featuredPosts: BlogPost[]
}

export function FeaturedPost({ featuredPosts }: FeaturedPostProps) {
  if (!featuredPosts?.length) return null

  return (
    <div className="mb-12">
      <h2 className="mb-6 font-bold text-2xl">Featured Posts</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {featuredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group relative block h-[300px] overflow-hidden rounded-lg"
          >
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="mb-2 font-semibold text-xl">{post.title}</h3>
                <p className="mb-4 line-clamp-2 text-gray-200 text-sm">{post.excerpt}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
