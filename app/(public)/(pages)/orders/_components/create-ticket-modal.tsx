"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/hooks/use-user"
import { useCreateSupportTicket } from "@/queries/support-tickets"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
})

export function CreateTicketModal() {
  const [open, setOpen] = useState(false)
  const { data: user } = useUser()
  const { mutate: createTicket, isPending } = useCreateSupportTicket()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
      priority: "medium",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTicket(
      {
        ...values,
        user_id: user?.id,
      },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
        },
      }
    )
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" icon={Plus} iconPlacement="left">
          Create Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ticket subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your issue"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Ticket"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
