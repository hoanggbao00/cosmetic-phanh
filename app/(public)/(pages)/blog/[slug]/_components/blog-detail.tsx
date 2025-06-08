import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/types/tables"
import { format } from "date-fns"
import { Calendar, ChevronLeft, Clock, Facebook, Twitter } from "lucide-react"
import Link from "next/link"
import { BookmarkStatus } from "./bookmark-status"
import { CopyPost } from "./copy-post"
import { ReadingProgress } from "./reading-progress"
import RelatedPost from "./related-post"

interface Props {
  post: BlogPost & {
    category: {
      id: string
      name: string
    }
  }
}

export default function BlogDetailView({ post }: Props) {
  return (
    <div className="relative">
      <ReadingProgress />

      <div className="mx-auto w-full px-4 py-8">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link href="/blog" className="flex items-center font-medium text-sm hover:underline">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="mx-auto max-w-6xl">
          <header className="mb-8">
            {/* Categories */}
            <div className="mb-4 flex flex-wrap gap-2">{post.category?.name}</div>

            {/* Title */}
            <h1 className="mb-4 font-bold text-3xl md:text-4xl lg:text-5xl">{post.title}</h1>

            {/* Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>5 min read</span>
              </div>
              <div>
                - by <span className="font-medium">Admin</span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </header>

          {/* Content and Sidebar Layout */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share and Bookmark */}
              <div className="my-12 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Share:</span>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Share on Facebook</span>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Share on Twitter</span>
                  </Button>
                  <CopyPost />
                </div>
                <BookmarkStatus />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8 lg:w-1/3">
              <div className="sticky top-20">
                {/* Related Posts */}
                <div>
                  <h3 className="mb-4 font-medium text-lg">Related Posts</h3>
                  <RelatedPost />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
