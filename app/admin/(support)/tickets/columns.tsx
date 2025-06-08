"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SupportTicket } from "@/types/tables/support_tickets"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react"

interface GetTicketColumnsProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: SupportTicket["status"]) => void
  onUpdatePriority: (id: string, priority: SupportTicket["priority"]) => void
}

const priorityColors = {
  low: "default",
  medium: "warning",
  high: "destructive",
} as const

const statusColors = {
  open: "default",
  in_progress: "warning",
  resolved: "success",
  closed: "secondary",
} as const

export function getTicketColumns({
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdatePriority,
}: GetTicketColumnsProps): ColumnDef<SupportTicket>[] {
  return [
    {
      accessorKey: "ticket_number",
      header: "Ticket #",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.original.priority
        return (
          // @ts-expect-error BadgeVariant is not exported
          <Badge variant={priorityColors[priority]}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={statusColors[status]}>
            {status
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "guest_email",
      header: "Contact",
      cell: ({ row }) => row.original.guest_email || "N/A",
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => format(new Date(row.original.created_at), "MMM dd, yyyy HH:mm"),
    },
    {
      accessorKey: "updated_at",
      header: "Last Updated",
      cell: ({ row }) => format(new Date(row.original.updated_at), "MMM dd, yyyy HH:mm"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(ticket.id)}>
                <Pencil className="mr-2 size-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => onUpdateStatus(ticket.id, "open")}>
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateStatus(ticket.id, "closed")}>
                    Closed
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Update Priority</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => onUpdatePriority(ticket.id, "low")}>
                    Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdatePriority(ticket.id, "medium")}>
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdatePriority(ticket.id, "high")}>
                    High
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(ticket.id)} className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
