import type { BlogPost } from "@/types/tables/blog_posts"
import { format } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import Link from "next/link"

interface FeaturedPostCardProps {
  post: BlogPost & {
    author: {
      name: string
      avatar_url: string
    }
    category: {
      name: string
    }
  }
}

export const FeaturedPostCard = ({ post }: FeaturedPostCardProps) => {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
        <img
          src={post.featured_image || "/images/placeholder.jpg"}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {format(new Date(post.published_at || post.created_at), "MMM dd, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {Math.ceil(post.content.length / 1000)} min read
          </span>
        </div>
        <h3 className="line-clamp-2 font-semibold text-xl transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <img
              src={post.author.avatar_url || "/images/placeholder-avatar.jpg"}
              alt={post.author.name}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-medium">{post.author.name}</p>
            <p className="text-muted-foreground">{post.category.name}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
