"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useUpdateUser } from "@/queries/users"
import type { Profiles } from "@/types/tables"
import { useEffect } from "react"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(1, "Full name is required"),
  avatar_url: z.string().nullable(),
  role: z.string(),
})

type FormValues = z.infer<typeof formSchema>

interface UserDialogProps {
  user?: Profiles | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export default function UserDialog({ user, open, onOpenChange, onClose }: UserDialogProps) {
  const { mutate: updateUser } = useUpdateUser()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      avatar_url: user?.avatar_url || null,
      role: user?.role || "user",
    },
  })

  const onSubmit = (values: FormValues) => {
    if (user) {
      updateUser(
        { id: user.id, profile: values },
        {
          onSuccess: () => {
            onClose()
            form.reset()
          },
        }
      )
    }
  }

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        full_name: user.full_name || "",
        avatar_url: user.avatar_url || null,
        role: user.role || "user",
      })
    }
  }, [user, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{user ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
