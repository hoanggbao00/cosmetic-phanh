"use client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProductReviewDeleteMutation, useProductReviewsQuery } from "@/queries/product-reviews"
import type { ProductReview } from "@/types/tables/product_reviews"
import type { Row } from "@tanstack/react-table"
import { Loader2, MoreHorizontalIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { columns } from "./columns"
import ReplyDialog from "./reply-dialog"

export default function ProductReviewsPage() {
  const { data: reviews, isLoading } = useProductReviewsQuery()
  const { mutate: deleteReview } = useProductReviewDeleteMutation()
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)

  const handleReply = (review: ProductReview) => {
    setSelectedReview(review)
    setReplyDialogOpen(true)
  }

  const handleDelete = (review: ProductReview) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(review.id)
    }
  }

  const enhancedColumns = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }: { row: Row<ProductReview> }) => {
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
                <DropdownMenuItem onClick={() => handleReply(review)}>
                  {review.admin_reply ? "Edit Reply" : "Reply"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(review)} className="text-destructive">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }
    }
    return col
  })

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-8">
      <div>
        <h2 className="font-bold text-3xl tracking-tight">Product Reviews</h2>
        <p className="text-muted-foreground">Manage customer reviews and responses.</p>
      </div>

      <DataTable columns={enhancedColumns} data={reviews || []} />

      <ReplyDialog
        review={selectedReview}
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
      />
    </div>
  )
}
