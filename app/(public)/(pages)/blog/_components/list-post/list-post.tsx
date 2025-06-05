"use client"

import { FadeUpContainer, FadeUpItem } from "@/components/motion/fade-up"
import { Button } from "@/components/ui/button"
import { useBlogPosts } from "@/queries/blog-posts"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { PostCard } from "./post-card"

interface ListPostProps {
  searchQuery: string
  selectedCategory: string
}

export const ListPost = ({ searchQuery, selectedCategory }: ListPostProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const limit = 10

  const { data: result, isLoading } = useBlogPosts({
    page: currentPage,
    limit,
    searchQuery,
    categoryId: selectedCategory || undefined,
  })

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`/blog?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (!result?.data.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-card p-8 text-center">
        <div className="max-w-md space-y-2">
          <h3 className="font-medium text-lg">No posts found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <FadeUpContainer className="grid grid-cols-1 gap-4 md:gap-6" delay={0.5}>
        {result.data.map((post) => (
          <FadeUpItem key={post.id}>
            <PostCard post={post} />
          </FadeUpItem>
        ))}
      </FadeUpContainer>

      {result.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(result.currentPage - 1)}
              disabled={result.currentPage === 1}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>

            {Array.from({ length: Math.min(3, result.totalPages) }).map((_, index) => {
              let pageNumber: number
              if (result.currentPage <= 2) {
                pageNumber = index + 1
              } else if (result.currentPage >= result.totalPages - 1) {
                pageNumber = result.totalPages - 2 + index
              } else {
                pageNumber = result.currentPage - 1 + index
              }

              if (pageNumber > result.totalPages) return null

              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === result.currentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(result.currentPage + 1)}
              disabled={result.currentPage === result.totalPages}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
