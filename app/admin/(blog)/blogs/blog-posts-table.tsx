"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBlogPosts, useDeleteBlogPost } from "@/queries/blog-posts"
import type { BlogPost } from "@/types/tables/blog_posts"
import { EditIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function BlogPostsTable() {
  const router = useRouter()

  const { data: posts } = useBlogPosts({ isAdmin: true })
  const { mutate: deletePost } = useDeleteBlogPost()

  const onEditPost = (post: BlogPost) => {
    router.push(`/admin/blogs/${post.id}`)
  }

  const columns: ColumnDef<BlogPost>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={
              status === "published" ? "default" : status === "draft" ? "secondary" : "destructive"
            }
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "-"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "is_featured",
      header: "Featured",
      cell: ({ row }) => {
        return row.original.is_featured ? "Yes" : "No"
      },
    },
    {
      accessorKey: "published_at",
      header: "Published At",
      cell: ({ row }) => {
        const date = row.original.published_at
        return date ? format(new Date(date), "PPP") : "-"
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.original.created_at), "PPP"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const post = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  onEditPost(post)
                }}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this post?")) {
                    deletePost(post.id, {
                      onSuccess: () => {
                        toast.success("Post deleted successfully")
                        router.refresh()
                      },
                      onError: () => {
                        toast.error("Failed to delete post")
                      },
                    })
                  }
                }}
                className="text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/blogs/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Post
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={posts?.data || []} />
    </div>
  )
}
