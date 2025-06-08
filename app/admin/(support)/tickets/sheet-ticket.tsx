"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useSupportTicketQueryById, useSupportTicketUpdateMutation } from "@/queries/support-ticket"
import {
  useSupportTicketRepliesQuery,
  useSupportTicketReplyMutation,
} from "@/queries/support-ticket-reply"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { SendIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["open", "closed"]),
  assigned_to: z.string().nullable(),
})

interface SheetTicketProps {
  id: string | null
  handleClose: () => void
}

export default function SheetTicket({ id, handleClose }: SheetTicketProps) {
  const { data: ticket } = useSupportTicketQueryById(id)
  const { data: replies, isLoading: isRepliesLoading } = useSupportTicketRepliesQuery(id)
  const { mutate: updateTicket } = useSupportTicketUpdateMutation()
  const [replyMessage, setReplyMessage] = useState("")
  const replyMutation = useSupportTicketReplyMutation(id || "", () => setReplyMessage(""))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: "low",
      status: "open",
      assigned_to: null,
    },
  })

  useEffect(() => {
    if (ticket) {
      form.reset({
        priority: ticket.priority,
        status: ticket.status,
        assigned_to: ticket.assigned_to,
      })
    }
  }, [ticket, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (id) {
      updateTicket({ id, ...values })
    }
  }

  const handleSendReply = () => {
    if (!replyMessage.trim()) return
    replyMutation.mutate({
      message: replyMessage,
      is_admin_reply: true,
    })
  }

  if (!ticket) return null

  return (
    <SheetContent className="sm:max-w-2xl">
      <SheetHeader className="px-0 pb-0">
        <SheetTitle>Ticket #{ticket.ticket_number}</SheetTitle>
        <SheetDescription>
          {format(new Date(ticket.created_at), "MMM dd, yyyy HH:mm")} <br />
          Last updated {format(new Date(ticket.updated_at), "MMM dd, yyyy HH:mm")}
        </SheetDescription>
      </SheetHeader>
      <Separator />

      <div className="space-y-4">
        <h3>
          <span className="text-muted-foreground">Subject:</span>{" "}
          <span className="whitespace-pre-wrap font-medium">{ticket.subject}</span>
        </h3>

        <div>
          <span className="text-muted-foreground">Message:</span>{" "}
          <span className="whitespace-pre-wrap font-medium">{ticket.message}</span>
        </div>

        <div>
          <span className="text-muted-foreground">Contact:</span>{" "}
          <span className="font-medium">{ticket.guest_email || "N/A"}</span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full border-border">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full border-border">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Form>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h3 className="font-medium text-lg">Replies</h3>

          {isRepliesLoading ? (
            <div>Loading replies...</div>
          ) : (
            <div className="max-h-[300px] space-y-4 overflow-y-auto">
              {replies?.map((reply) => (
                <Card
                  key={reply.id}
                  className={cn("w-full gap-2 py-0", reply.is_admin_reply && "bg-primary/5")}
                >
                  <CardHeader className="flex flex-row items-center gap-4 p-2 pb-0">
                    <Avatar>
                      <AvatarImage src={reply.profiles?.avatar_url || ""} />
                      <AvatarFallback>{reply.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm">
                        {reply.profiles?.full_name || "User"}
                        {reply.is_admin_reply && (
                          <span className="ml-2 text-primary text-xs">(Admin)</span>
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground text-xs">
                        {format(new Date(reply.created_at), "MMM dd, yyyy HH:mm")}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="px-2 pt-0 pb-2">
                    <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <Textarea
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendReply}
                disabled={!replyMessage.trim() || replyMutation.isPending}
              >
                <SendIcon className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  )
}
