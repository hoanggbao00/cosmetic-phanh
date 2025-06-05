"use client"

import BlogPostCard from "@/app/(public)/_components/blog-post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLatestBlogPosts } from "@/queries/blog"

export default function RelatedPosts() {
  const { data: posts, isLoading, error } = useLatestBlogPosts()

  if (error) {
    return <div className="text-center text-red-500">Failed to load blog posts</div>
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (!posts?.length) {
    return <div className="text-center text-gray-500">No blog posts found</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
