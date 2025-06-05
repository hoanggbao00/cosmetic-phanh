"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { Tables } from "@/types/supabase"

interface BlogDetailViewProps {
  post: Tables<"blog_posts"> & {
    category: Tables<"blog_categories"> | null
    author: Tables<"profiles"> | null
  }
}

export default function BlogDetailView({ post }: BlogDetailViewProps) {
  return (
    <Card className="mt-8">
      {post.featured_image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <img src={post.featured_image} alt={post.title} className="size-full object-cover" />
        </div>
      )}
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.author?.avatar_url || undefined} />
            <AvatarFallback>{post.author?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium text-sm">{post.author?.full_name}</p>
            <p className="text-muted-foreground text-xs">{formatDate(post.created_at)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-bold text-3xl">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-muted-foreground">{post.excerpt}</p>}
          {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </CardContent>
    </Card>
  )
}
