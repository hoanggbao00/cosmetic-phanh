"use client"
import { Button } from "@/components/ui/button"
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
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useSupportTicketQueryById, useSupportTicketUpdateMutation } from "@/queries/support-ticket"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
  assigned_to: z.string().nullable(),
})

interface SheetTicketProps {
  id: string | null
  handleClose: () => void
}

export default function SheetTicket({ id, handleClose }: SheetTicketProps) {
  const { data: ticket } = useSupportTicketQueryById(id)
  const { mutate: updateTicket } = useSupportTicketUpdateMutation()

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
    handleClose()
  }

  if (!ticket) return null

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Ticket #{ticket.ticket_number}</SheetTitle>
        <SheetDescription>View and update ticket details</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="font-medium">Subject</h3>
          <p className="mt-1">{ticket.subject}</p>
        </div>

        <div>
          <h3 className="font-medium">Message</h3>
          <p className="mt-1 whitespace-pre-wrap">{ticket.message}</p>
        </div>

        <div>
          <h3 className="font-medium">Contact</h3>
          <p className="mt-1">{ticket.guest_email || "N/A"}</p>
        </div>

        <div className="flex gap-4">
          <div>
            <h3 className="font-medium">Created</h3>
            <p className="mt-1">{format(new Date(ticket.created_at), "MMM dd, yyyy HH:mm")}</p>
          </div>
          <div>
            <h3 className="font-medium">Last Updated</h3>
            <p className="mt-1">{format(new Date(ticket.updated_at), "MMM dd, yyyy HH:mm")}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
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
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
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
      </div>
    </SheetContent>
  )
}
