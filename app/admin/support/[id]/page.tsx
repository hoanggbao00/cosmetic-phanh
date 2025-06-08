"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useSupportTicketQueryById } from "@/queries/support-ticket"
import {
  useSupportTicketRepliesQuery,
  useSupportTicketReplyMutation,
} from "@/queries/support-ticket-reply"
import { format } from "date-fns"
import { ArrowLeftIcon, SendIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [replyMessage, setReplyMessage] = useState("")

  const { data: ticket, isLoading: isTicketLoading } = useSupportTicketQueryById(params.id)
  const { data: replies, isLoading: isRepliesLoading } = useSupportTicketRepliesQuery(params.id)
  const replyMutation = useSupportTicketReplyMutation(params.id)

  const handleSendReply = () => {
    if (!replyMessage.trim()) return
    replyMutation.mutate(replyMessage, {
      onSuccess: () => setReplyMessage(""),
    })
  }

  if (isTicketLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!ticket) {
    return <div>Ticket not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="font-bold text-2xl">Ticket #{ticket.ticket_number}</h1>
        <Badge>{ticket.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ticket.subject}</CardTitle>
          <CardDescription>Created on {format(new Date(ticket.created_at), "PPP")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{ticket.message}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">Replies</h2>

        {isRepliesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : replies?.length === 0 ? (
          <p className="text-muted-foreground">No replies yet</p>
        ) : (
          <div className="space-y-4">
            {replies?.map((reply) => (
              <Card key={reply.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={reply.profiles?.avatar_url || ""} />
                    <AvatarFallback>{reply.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {reply.profiles?.full_name || "User"}
                    </CardTitle>
                    <CardDescription>{format(new Date(reply.created_at), "PPP")}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{reply.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Send Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleSendReply}
                disabled={!replyMessage.trim() || replyMutation.isPending}
              >
                <SendIcon className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
