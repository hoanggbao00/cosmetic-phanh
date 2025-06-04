"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Voucher } from "@/types/tables/vouchers"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react"

interface GetVoucherColumnsProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
}

export function getVoucherColumns({
  onEdit,
  onDelete,
  onToggleActive,
}: GetVoucherColumnsProps): ColumnDef<Voucher>[] {
  return [
    {
      id: "is_active",
      header: "Active",
      cell: ({ row }) => {
        const voucher = row.original
        return (
          <Checkbox
            checked={voucher.is_active}
            onCheckedChange={(checked) => onToggleActive(voucher.id, checked as boolean)}
          />
        )
      },
    },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <Badge variant={type === "percentage" ? "default" : "secondary"}>
            {type === "percentage" ? "Percentage" : "Fixed Amount"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        const { type, value } = row.original
        return type === "percentage" ? `${value}%` : `$${value.toFixed(2)}`
      },
    },
    {
      accessorKey: "used_count",
      header: "Usage",
      cell: ({ row }) => {
        const { used_count, usage_limit } = row.original
        return usage_limit ? `${used_count}/${usage_limit}` : used_count
      },
    },
    {
      accessorKey: "starts_at",
      header: "Start Date",
      cell: ({ row }) => format(new Date(row.original.starts_at), "MMM dd, yyyy"),
    },
    {
      accessorKey: "expires_at",
      header: "Expiry Date",
      cell: ({ row }) => {
        const expiryDate = row.original.expires_at
        return expiryDate ? format(new Date(expiryDate), "MMM dd, yyyy") : "Never"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const voucher = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(voucher.id)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(voucher.id)}>
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
