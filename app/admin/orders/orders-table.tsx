"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteOrder, useOrders } from "@/queries/orders"
import type { Order } from "@/types/tables/orders"
import { EditIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

export default function OrdersTable() {
  const router = useRouter()
  const { data: orders } = useOrders()
  const { mutate: deleteOrder } = useDeleteOrder()

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "order_number",
      header: "Order Number",
    },
    {
      accessorKey: "guest_email",
      header: "Customer Email",
      cell: ({ row }) => row.original.guest_email || row.original.user_id || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={
              status === "delivered"
                ? "default"
                : status === "processing" || status === "confirmed"
                  ? "secondary"
                  : status === "cancelled" || status === "refunded"
                    ? "destructive"
                    : "outline"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.original.payment_status
        return (
          <Badge
            variant={
              status === "paid"
                ? "default"
                : status === "pending"
                  ? "secondary"
                  : status === "failed"
                    ? "destructive"
                    : "outline"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total",
      cell: ({ row }) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.original.total_amount)
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.original.created_at), "PPP"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/orders/${order.id}`} className="flex items-center">
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this order?")) {
                    deleteOrder(order.id, {
                      onSuccess: () => {
                        toast.success("Order deleted successfully")
                        router.refresh()
                      },
                      onError: () => {
                        toast.error("Failed to delete order")
                      },
                    })
                  }
                }}
                className="text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/orders/new" className="flex items-center">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Order
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={orders || []} />
    </div>
  )
}
