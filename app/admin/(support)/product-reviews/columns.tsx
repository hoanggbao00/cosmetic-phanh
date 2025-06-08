"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ProductReview } from "@/types/tables/product_reviews"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, MoreHorizontalIcon, StarIcon, TrashIcon } from "lucide-react"

export const columns: ColumnDef<ProductReview>[] = [
  {
    accessorKey: "products.name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original.products
      return (
        <div className="flex items-center gap-3">
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          )}
          <span className="font-medium">{product.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "reviewer.full_name",
    header: "Customer",
    cell: ({ row }) => {
      const reviewer = row.original.reviewer
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={reviewer.avatar_url || undefined} />
            <AvatarFallback>{reviewer.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{reviewer.full_name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Rating
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{row.original.rating}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => {
      const review = row.original
      return (
        <div className="max-w-[400px]">
          <p className="line-clamp-2">{review.comment}</p>
          {review.admin_reply && (
            <div className="mt-2">
              <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                <span className="font-semibold">Replied:</span> {review.admin_reply}
                {review.admin && (
                  <span className="ml-1 text-muted-foreground text-xs">
                    - {review.admin.full_name}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.created_at), "MMM dd, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const review = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{review.admin_reply ? "Edit Reply" : "Reply"}</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
