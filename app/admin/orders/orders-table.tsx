"use client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDeleteOrder, useUpdateOrder } from "@/queries/orders"
import type { Order } from "@/types/tables/orders"
import { supabase } from "@/utils/supabase/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { EditIcon, EyeIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

interface OrdersTableProps {
  initialOrders: Order[]
}

export default function OrdersTable({ initialOrders }: OrdersTableProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: orders, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    initialData: initialOrders,
  })

  const { mutate: deleteOrder } = useDeleteOrder()
  const { mutate: updateOrder } = useUpdateOrder()

  const handleUpdateStatus = async (order: Order, status: Order["status"]) => {
    updateOrder(
      { id: order.id, status },
      {
        onSuccess: (updatedOrder) => {
          // Optimistically update the orders list
          const updatedOrders = orders?.map((o) =>
            o.id === order.id ? { ...o, status: status } : o
          )
          queryClient.setQueryData(["orders"], updatedOrders)

          // Also update the individual order cache if it exists
          queryClient.setQueryData(["orders", order.id], updatedOrder)

          router.refresh()
        },
        onError: () => {
          toast.error("Failed to update order status")
          refetch() // Refetch on error to ensure data consistency
        },
      }
    )
  }

  const handleUpdatePaymentStatus = async (
    order: Order,
    payment_status: Order["payment_status"]
  ) => {
    updateOrder(
      { id: order.id, payment_status },
      {
        onSuccess: (updatedOrder) => {
          // Optimistically update the orders list
          const updatedOrders = orders?.map((o) =>
            o.id === order.id ? { ...o, payment_status } : o
          )
          queryClient.setQueryData(["orders"], updatedOrders)

          // Also update the individual order cache if it exists
          queryClient.setQueryData(["orders", order.id], updatedOrder)

          router.refresh()
        },
        onError: () => {
          toast.error("Failed to update payment status")
          refetch() // Refetch on error to ensure data consistency
        },
      }
    )
  }

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
        const order = row.original
        return (
          <Select
            value={order.status}
            onValueChange={(value: Order["status"]) => handleUpdateStatus(order, value)}
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
              handleUpdatePaymentStatus(order, value)
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
              <DropdownMenuItem asChild>
                <Link href={`/admin/orders/${order.id}/edit`} className="flex items-center">
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
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">
          Total Orders: <span className="font-medium text-foreground">{orders?.length || 0}</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
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
