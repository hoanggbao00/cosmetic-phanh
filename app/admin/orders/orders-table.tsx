"use client"

import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { getOrders } from "@/actions/orders"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDeleteOrder, useUpdateOrder } from "@/queries/orders"
import type { Profiles } from "@/types/tables"
import type { Order } from "@/types/tables/orders"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { EyeIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

interface OrdersTableProps {
  initialOrders: (Order & { profiles: Profiles })[]
}

export default function OrdersTable({ initialOrders }: OrdersTableProps) {
  const router = useRouter()
  const { data: orders, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const result = await getOrders({ isPaginated: false })
      return result.data as (Order & { profiles: Profiles })[]
    },
    initialData: initialOrders,
  })

  const { mutate: deleteOrder } = useDeleteOrder()
  const { mutate: updateOrder } = useUpdateOrder()

  const handleUpdateStatus = async (id: string, status: Order["status"]) => {
    if (window.confirm(`Are you sure you want to update order status to ${status}?`)) {
      updateOrder(
        { id, order: { status } },
        {
          onSuccess: () => {
            refetch()
          },
          onError: (error: Error) => {
            console.error("Failed to update status:", error)
          },
        }
      )
    }
  }

  const handleUpdatePaymentStatus = async (id: string, payment_status: Order["payment_status"]) => {
    if (window.confirm(`Are you sure you want to update payment status to ${payment_status}?`)) {
      updateOrder(
        { id, order: { payment_status } },
        {
          onSuccess: () => {
            refetch()
          },
          onError: (error: Error) => {
            console.error("Failed to update payment status:", error)
          },
        }
      )
    }
  }

  const columns: ColumnDef<Order & { profiles: Profiles }>[] = [
    {
      accessorKey: "order_number",
      header: "Order Number",
    },
    {
      accessorKey: "guest_email",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original
        return (
          order.profiles?.full_name || order.shipping_address?.full_name || order.guest_email || "-"
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original
        return (
          <Select
            value={order.status}
            onValueChange={(value: Order["status"]) => handleUpdateStatus(order.id, value)}
          >
            <SelectTrigger className="w-fit border-none shadow-none">
              <SelectValue>
                <Badge
                  variant={
                    order.status === "delivered"
                      ? "default"
                      : order.status === "processing" || order.status === "confirmed"
                        ? "secondary"
                        : order.status === "cancelled" || order.status === "refunded"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const order = row.original
        return (
          <Select
            value={order.payment_status}
            onValueChange={(value: Order["payment_status"]) =>
              handleUpdatePaymentStatus(order.id, value)
            }
          >
            <SelectTrigger className="w-fit border-none shadow-none">
              <SelectValue>
                <Badge
                  variant={
                    order.payment_status === "paid"
                      ? "default"
                      : order.payment_status === "pending"
                        ? "secondary"
                        : order.payment_status === "failed"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
            </SelectContent>
          </Select>
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
                  <EyeIcon className="mr-2 h-4 w-4" />
                  View
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
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">
          Total Orders: <span className="font-medium text-foreground">{orders?.length || 0}</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/orders/new" className="flex items-center">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Order
            </Link>
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={orders || []} />
    </div>
  )
}
