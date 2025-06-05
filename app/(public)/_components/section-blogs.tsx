"use client"

import { StarIcon } from "@/assets/icons/star-icon"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { useBlogPosts } from "@/queries/blog-posts"
import type { BlogPost } from "@/types/tables"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SectionBlogs() {
  const { data: blogPosts } = useBlogPosts()
  const [currentIndex, setCurrentIndex] = useState(0)

  const visiblePosts = blogPosts?.data.slice(currentIndex, currentIndex + 3)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      blogPosts?.data.length ? Math.min(blogPosts.data.length - 3, prev + 1) : prev
    )
  }

  return (
    <section className="w-full bg-secondary px-4 py-16 font-serif">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StarIcon className="size-4 animate-spin text-primary" />
              <span className="text-sm">Updates & Insights</span>
            </div>
            <h2 className="font-semibold text-3xl text-gray-900 md:text-4xl lg:text-5xl">
              Beauty Talk & Trends
            </h2>
          </div>

          {/* Pagination */}
          <div className="flex gap-2">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="rounded-md p-3 text-white disabled:opacity-50"
              size="icon"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentIndex >= (blogPosts?.data.length || 0) - 3}
              className="rounded-md p-3 text-white disabled:opacity-50"
              size="icon"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts?.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href="#" className="mb-4 block">
        <Button effect="shineHover" variant="ghost" className="h-full p-0">
          <div className="overflow-hidden rounded-lg">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              width={600}
              height={400}
              className="h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Button>
      </Link>

      <div className="mb-2 flex items-center justify-center gap-2 text-primary text-sm">
        <CalendarIcon className="size-4" />
        <span>{formatDate(post.created_at)}</span>
        <span>—</span>
        <span>Admin</span>
      </div>

      <Link href="#" className="block px-4">
        <h3 className="mb-3 text-center font-semibold text-xl transition-colors hover:text-primary">
          {post.title}
        </h3>
      </Link>

      <p className="mb-4 line-clamp-3 h-16 px-4 text-muted-foreground text-sm leading-relaxed">
        {post.excerpt}
      </p>

      <Link
        href="#"
        className="mx-auto block w-fit border-gray-900 border-b text-center font-medium text-gray-900 text-sm transition-colors hover:border-primary hover:text-primary"
      >
        Read More
      </Link>
    </article>
  )
}
