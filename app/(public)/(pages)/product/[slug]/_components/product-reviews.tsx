"use client"

import { checkUserCanReview } from "@/actions/reviews"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import { useCreateReview, useDeleteReview, useReplyToReview } from "@/queries/reviews"
import type { ReplyData, ReviewData } from "@/types/reviews"
import type { Tables } from "@/types/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { PencilIcon, StarIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
}) satisfies z.ZodType<Omit<ReviewData, "userId" | "productId">>

const replySchema = z.object({
  reply: z.string().min(10, "Reply must be at least 10 characters"),
}) satisfies z.ZodType<Pick<ReplyData, "reply">>

type ReviewWithUser = Tables<"product_reviews"> & {
  user: Pick<Tables<"profiles">, "id" | "full_name" | "avatar_url">
}

interface ProductReviewsProps {
  productId: string
  reviews: ReviewWithUser[]
}

export default function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const { data: user } = useUser()
  const [canReview, setCanReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState<string>("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingReply, setEditingReply] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState(5)

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  })

  const replyForm = useForm({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply: "",
    },
  })

  const { mutate: createReview } = useCreateReview()
  const { mutate: deleteReview } = useDeleteReview()
  const { mutate: replyToReview } = useReplyToReview()
  const queryClient = useQueryClient()

  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!user) return
      const result = await checkUserCanReview(user.id, productId)
      setCanReview(result.canReview)
      setReviewMessage(result.message || "")
    }

    checkReviewStatus()
  }, [user, productId])

  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    if (!user) return

    createReview(
      {
        productId,
        userId: user.id,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          form.reset()
          toast.success("Review submitted successfully")
        },
        onError: () => {
          toast.error("Failed to submit review")
        },
      }
    )
  }

  const onReply = (reviewId: string, data: z.infer<typeof replySchema>) => {
    if (!user) return

    replyToReview(
      {
        reviewId,
        reply: data.reply,
        reply_at: new Date().toISOString(),
        reply_by: user.id,
      },
      {
        onSuccess: () => {
          replyForm.reset()
          setReplyingTo(null)
          setEditingReply(null)
          queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] })
          toast.success(
            editingReply ? "Reply updated successfully" : "Reply submitted successfully"
          )
        },
        onError: () => {
          toast.error(editingReply ? "Failed to update reply" : "Failed to submit reply")
        },
      }
    )
  }

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId, {
      onSuccess: () => {
        toast.success("Review deleted successfully")
      },
      onError: () => {
        toast.error("Failed to delete review")
      },
    })
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating)
    form.setValue("rating", rating, { shouldValidate: true })
  }

  const handleEditReply = (reviewId: string, currentReply: string) => {
    setEditingReply(reviewId)
    replyForm.setValue("reply", currentReply)
  }

  return (
    <div className="space-y-8">
      <h2 className="font-bold text-2xl">Customer Reviews</h2>

      {/* No Reviews Message */}
      {reviews.length === 0 && (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-2">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-10 overflow-hidden rounded-full bg-gray-100">
                    {review.user.avatar_url ? (
                      <img
                        src={review.user.avatar_url}
                        alt={review.user.full_name || "User"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-primary/10 font-semibold text-primary">
                        {review.user.full_name?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.user.full_name || "Anonymous"}</h4>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={`review-${review.id}-star-${i}-${i < review.rating}`}
                          className={cn(
                            "size-4",
                            i < review.rating ? "fill-primary text-primary" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {user?.role === "admin" && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)}>
                    <Trash2Icon className="size-4 text-destructive" />
                  </Button>
                )}
              </div>
              <p className="text-gray-600">{review.comment}</p>

              {/* Admin Reply */}
              {review.admin_reply && editingReply !== review.id && (
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Admin Reply:</p>
                    {user?.role === "admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditReply(review.id, review.admin_reply || "")}
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-600">{review.admin_reply}</p>
                </div>
              )}

              {/* Reply Form for Admin */}
              {user?.role === "admin" && (
                <div>
                  {replyingTo === review.id || editingReply === review.id ? (
                    <Form {...replyForm}>
                      <form
                        onSubmit={replyForm.handleSubmit((data) => onReply(review.id, data))}
                        className="space-y-2"
                      >
                        <div className="space-y-2">
                          <label htmlFor="reply" className="font-medium text-sm">
                            {editingReply ? "Edit Reply" : "Your Reply"}
                          </label>
                          <Textarea
                            id="reply"
                            {...replyForm.register("reply")}
                            placeholder="Write your reply here..."
                            className="min-h-[50px]"
                          />
                          {replyForm.formState.errors.reply && (
                            <p className="text-destructive text-sm">
                              {replyForm.formState.errors.reply.message}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" size="sm">
                            {editingReply ? "Update Reply" : "Submit Reply"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null)
                              setEditingReply(null)
                              replyForm.reset()
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    !review.admin_reply && (
                      <Button variant="outline" size="sm" onClick={() => setReplyingTo(review.id)}>
                        Reply
                      </Button>
                    )
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Review Form */}
      {user?.role === "admin" ? (
        <Card className="gap-2 p-4">
          <h3 className="font-semibold text-lg">Write a Review</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const star = i + 1
                  return (
                    <button
                      key={`star-${star}`}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                    >
                      <StarIcon
                        className={cn(
                          "size-6",
                          "transition-colors duration-300 hover:text-primary",
                          selectedRating >= star ? "fill-primary text-primary" : "text-gray-300"
                        )}
                      />
                    </button>
                  )
                })}
                <input type="hidden" {...form.register("rating")} />
                {form.formState.errors.rating && (
                  <p className="text-destructive text-sm">{form.formState.errors.rating.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="comment" className="font-medium text-sm">
                  Your Review
                </label>
                <Textarea
                  id="comment"
                  {...form.register("comment")}
                  placeholder="Write your review here..."
                  className="min-h-[50px]"
                />
                {form.formState.errors.comment && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.comment.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Submit Review
              </Button>
            </form>
          </Form>
        </Card>
      ) : user ? (
        <Card className="p-6">
          <h3 className="font-semibold text-lg">Write a Review</h3>
          {canReview ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const star = i + 1
                    return (
                      <button
                        key={`star-${star}`}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                      >
                        <StarIcon
                          className={cn(
                            "size-6",
                            "transition-colors duration-300 hover:text-primary",
                            selectedRating >= star ? "fill-primary text-primary" : "text-gray-300"
                          )}
                        />
                      </button>
                    )
                  })}
                  <input type="hidden" {...form.register("rating")} />
                  {form.formState.errors.rating && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.rating.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="comment" className="font-medium text-sm">
                    Your Review
                  </label>
                  <Textarea
                    id="comment"
                    {...form.register("comment")}
                    placeholder="Write your review here..."
                    className="min-h-[50px]"
                  />
                  {form.formState.errors.comment && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.comment.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Submit Review
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>{reviewMessage}</p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Please login to write a review.</p>
          </div>
        </Card>
      )}
    </div>
  )
}
