"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useProductReviewUpdateMutation } from "@/queries/product-reviews"
import type { ProductReview } from "@/types/tables/product_reviews"
import { useState } from "react"

interface ReplyDialogProps {
  review: ProductReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ReplyDialog({ review, open, onOpenChange }: ReplyDialogProps) {
  const [reply, setReply] = useState(review?.admin_reply || "")
  const { mutate: updateReview, isPending } = useProductReviewUpdateMutation()

  const handleSubmit = () => {
    if (!review) return
    updateReview(
      { id: review.id, adminReply: reply },
      {
        onSuccess: () => {
          onOpenChange(false)
          setReply("")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
          <DialogDescription>
            Add your response to the customer&apos;s review. This will be publicly visible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">Customer Review</h4>
            <p className="text-muted-foreground text-sm">{review?.comment}</p>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Your Reply</h4>
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reply.trim() || isPending}>
            {isPending ? "Sending..." : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
