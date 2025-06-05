import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/types/tables"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="mb-4 block">
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

      <Link href={`/blog/${post.slug}`} className="block px-4">
        <h3 className="mb-3 text-center font-semibold text-xl transition-colors hover:text-primary">
          {post.title}
        </h3>
      </Link>

      <p className="mb-4 line-clamp-3 h-16 px-4 text-muted-foreground text-sm leading-relaxed">
        {post.excerpt}
      </p>

      <Link
        href={`/blog/${post.slug}`}
        className="mx-auto block w-fit border-gray-900 border-b text-center font-medium text-gray-900 text-sm transition-colors hover:border-primary hover:text-primary"
      >
        Read More
      </Link>
    </article>
  )
}
