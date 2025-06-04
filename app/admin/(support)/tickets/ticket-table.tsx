"use client"

import { DataTable } from "@/components/shared/data-table"
import { Sheet } from "@/components/ui/sheet"
import {
  useSupportTicketDeleteMutation,
  useSupportTicketQuery,
  useSupportTicketUpdateMutation,
} from "@/queries/support-ticket"
import type { SupportTicket } from "@/types/tables/support_tickets"
import type { ColumnDef } from "@tanstack/react-table"
import { Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { getTicketColumns } from "./columns"
import SheetTicket from "./sheet-ticket"

export default function TicketTable() {
  const { data, isLoading } = useSupportTicketQuery()

  const openSheetRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState<string | null>(null)

  const { mutate: deleteTicket } = useSupportTicketDeleteMutation()
  const { mutate: updateTicket } = useSupportTicketUpdateMutation()

  const handleEdit = (id: string) => {
    setId(id)
    setIsOpen(true)
  }

  const handleClose = () => {
    setId(null)
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteTicket(id)
  }

  const handleUpdateStatus = (id: string, status: SupportTicket["status"]) => {
    updateTicket({ id, status })
  }

  const handleUpdatePriority = (id: string, priority: SupportTicket["priority"]) => {
    updateTicket({ id, priority })
  }

  if (isLoading)
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2">
        <Loader2 className="size-10 animate-spin" />
        <p>Fetching data...</p>
      </div>
    )

  const columns = getTicketColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onUpdateStatus: handleUpdateStatus,
    onUpdatePriority: handleUpdatePriority,
  }) as ColumnDef<SupportTicket>[]

  return (
    <Sheet open={isOpen} modal={false}>
      <div className="flex size-full flex-col gap-2">
        {data && <DataTable columns={columns} data={data} className="h-[700px]" />}
      </div>
      <SheetTicket id={id} handleClose={handleClose} />
    </Sheet>
  )
}
