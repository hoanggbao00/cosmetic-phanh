"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { Tables } from "@/types/supabase"
import Link from "next/link"

interface PostCardProps {
  post: Tables<"blog_posts">
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group overflow-hidden transition-colors hover:border-primary">
        <div className="flex flex-col gap-4 md:flex-row">
          {post.featured_image && (
            <div className="relative aspect-video w-full overflow-hidden md:w-72">
              <img
                src={post.featured_image}
                alt={post.title}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-between p-6">
            <CardHeader className="space-y-2 p-0">
              <h3 className="line-clamp-2 font-bold text-xl transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              {post.excerpt && <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>}
            </CardHeader>
            <CardContent className="mt-4 flex items-center justify-between p-0">
              <div className="text-muted-foreground text-sm">{formatDate(post.created_at)}</div>
              {post.is_featured && <Badge variant="secondary">Featured</Badge>}
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  )
}
