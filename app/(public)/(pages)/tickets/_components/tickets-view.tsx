"use client"

import { createTicketReply } from "@/actions/support-ticket-replies"
import { createSupportTicket } from "@/actions/support-tickets"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { SupportTicket } from "@/types/tables/support_tickets"
import { format } from "date-fns"
import { ChevronDownIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface TicketsViewProps {
  tickets: SupportTicket[]
}

export default function TicketsView({ tickets }: TicketsViewProps) {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const shouldShowReply = (ticket: SupportTicket) => {
    if (!ticket.replies || ticket.replies.length === 0 || ticket.status === "closed") return false
    const lastReply = ticket.replies[ticket.replies.length - 1]
    // Hiển thị input reply nếu reply cuối cùng là từ admin
    return lastReply.user_id !== ticket.user_id
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const priority = formData.get("priority")
      if (!priority || typeof priority !== "string") {
        throw new Error("Invalid priority")
      }

      await createSupportTicket({
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        priority: priority as "low" | "medium" | "high",
      })
      toast.success("Ticket created successfully")
      setIsNewTicketOpen(false)
    } catch (error: unknown) {
      console.error("Failed to create ticket:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create ticket")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReply = async (e: React.FormEvent<HTMLFormElement>, ticketId: string) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get("reply")

    if (!message || typeof message !== "string") {
      toast.error("Please enter a message")
      return
    }

    try {
      await createTicketReply(ticketId, message)
      toast.success("Reply sent successfully")
      e.currentTarget?.reset()
    } catch (error: unknown) {
      console.error("Failed to send reply:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send reply")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">Support Tickets</h1>
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Support Ticket</DialogTitle>
                <DialogDescription>Please provide details about your issue</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Detailed explanation of your issue"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Ticket"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{ticket.subject}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      ticket.priority === "high" && "border-red-500 text-red-500",
                      ticket.priority === "medium" && "border-yellow-500 text-yellow-500",
                      ticket.priority === "low" && "border-green-500 text-green-500"
                    )}
                  >
                    {ticket.priority}
                  </Badge>
                  <Badge
                    className={cn(
                      "capitalize",
                      ticket.status === "open" && "bg-green-500",
                      ticket.status === "closed" && "bg-gray-500"
                    )}
                  >
                    {ticket.status}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Ticket #{ticket.ticket_number} • Created{" "}
                {format(new Date(ticket.created_at), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="whitespace-pre-wrap">
                <span className="text-muted-foreground">Message:</span> {ticket.message}
              </p>
              {ticket.replies && ticket.replies.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg px-0.5 py-1 hover:bg-muted">
                    <h3 className="font-semibold">
                      <u>Replies</u> ({ticket.replies.length}){" "}
                    </h3>
                    <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <div className="space-y-2">
                      {ticket.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={cn(
                            "rounded-lg p-2",
                            reply.user_id === ticket.user_id
                              ? "mr-4 ml-0 bg-muted"
                              : "mr-0 ml-4 bg-primary/10"
                          )}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className={cn(
                                "font-medium",
                                reply.user_id !== ticket.user_id && "text-primary"
                              )}
                            >
                              {reply.user?.full_name}
                              {reply.user_id !== ticket.user_id && " (Admin)"}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {format(new Date(reply.created_at), "PPP")}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                    {shouldShowReply(ticket) && (
                      <form
                        className="mt-1 flex w-full gap-2"
                        onSubmit={(e) => handleReply(e, ticket.id)}
                      >
                        <Input
                          name="reply"
                          placeholder="Type your reply..."
                          className="flex-1"
                          required
                        />
                        <Button type="submit">Reply</Button>
                      </form>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </CardContent>
          </Card>
        ))}

        {tickets.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-muted-foreground">
                You haven't created any support tickets yet.
              </p>
              <Button variant="link" onClick={() => setIsNewTicketOpen(true)} className="mt-2">
                Create your first ticket
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
