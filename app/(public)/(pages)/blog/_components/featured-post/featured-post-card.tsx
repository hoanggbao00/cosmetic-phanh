import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { BlogPost } from "@/types/tables"
import { format } from "date-fns"
import { Calendar, ChevronRight, Clock } from "lucide-react"
import Link from "next/link"

export const FeaturedPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card key={post.id} className="group gap-4 overflow-hidden">
      <div className="px-4">
        <Link href={`/blog/${post.id}`}>
          <div className="relative h-48 w-full overflow-hidden rounded-lg">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="absolute inset-0 size-full object-cover transition-all duration-300 group-hover:scale-105"
            />
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-black/70 text-white hover:bg-black/80"
            >
              Featured
            </Badge>
          </div>
        </Link>
      </div>

      {/* Categories and Title */}
      <CardHeader className="px-4">
        <div className="space-y-1">
          <Link
            href={`/blog/${post.id}`}
            className="line-clamp-2 transition-all duration-300 hover:text-primary hover:underline"
          >
            <h3 className="font-bold text-xl">{post.title}</h3>
          </Link>
        </div>
      </CardHeader>

      {/* Excerpt */}
      <CardContent className="px-4">
        <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
      </CardContent>

      {/* Author and Date */}
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <p className="font-medium text-sm">Admin</p>
          <div className="flex items-center text-muted-foreground text-xs">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
            <span className="mx-1">•</span>
            <Clock className="mr-1 h-3 w-3" />
            <span>5 min read</span>
          </div>
        </div>
        <Link
          href={`/blog/${post.id}`}
          className="flex items-center font-medium text-sm hover:underline"
        >
          Read more <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
