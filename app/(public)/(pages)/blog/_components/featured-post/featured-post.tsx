"use client"

import { FadeUpContainer, FadeUpItem } from "@/components/motion/fade-up"
import { Skeleton } from "@/components/ui/skeleton"
import { useFeaturedBlogPosts } from "@/queries/blog"
import { FeaturedPostCard } from "./featured-post-card"

export const FeaturedPost = () => {
  const { data: featuredPosts, isLoading } = useFeaturedBlogPosts()

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="mb-6 font-bold text-2xl">Featured Posts</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    featuredPosts &&
    featuredPosts.length > 0 && (
      <div className="mb-12">
        <h2 className="mb-6 font-bold text-2xl">Featured Posts</h2>
        <FadeUpContainer className="grid grid-cols-1 gap-6 md:grid-cols-2" delay={0.1}>
          {featuredPosts.map((post) => (
            <FadeUpItem key={post.id}>
              <FeaturedPostCard post={post} />
            </FadeUpItem>
          ))}
        </FadeUpContainer>
      </div>
    )
  )
}
