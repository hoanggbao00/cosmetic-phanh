"use client"

import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import {
    useVoucherDeleteMutation,
    useVoucherQuery,
    useVoucherUpdateMutation,
} from "@/queries/voucher"
import type { Voucher } from "@/types/tables/vouchers"
import type { ColumnDef } from "@tanstack/react-table"
import { Loader2, PlusCircleIcon } from "lucide-react"
import { useRef, useState } from "react"
import { getVoucherColumns } from "./columns"
import SheetVoucher from "./sheet-voucher"

export default function VoucherTable() {
  const { data, isLoading } = useVoucherQuery()

  const openSheetRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState<string | null>(null)

  const { mutate: deleteVoucher } = useVoucherDeleteMutation()
  const { mutate: updateVoucher } = useVoucherUpdateMutation()

  const handleAdd = () => {
    setId("new")
    setIsOpen(true)
  }

  const handleEdit = (id: string) => {
    setId(id)
    setIsOpen(true)
  }

  const handleClose = () => {
    setId(null)
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteVoucher(id)
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateVoucher({ id, is_active: isActive })
  }

  if (isLoading)
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2">
        <Loader2 className="size-10 animate-spin" />
        <p>Fetching data...</p>
      </div>
    )

  const columns = getVoucherColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleActive: handleToggleActive,
  }) as ColumnDef<Voucher>[]

  return (
    <Sheet open={isOpen} modal={false}>
      <div className="flex size-full flex-col gap-2">
        <div className="flex items-center justify-end">
          <SheetTrigger asChild>
            <Button icon={PlusCircleIcon} iconPlacement="right" size="sm" onClick={handleAdd}>
              Add
            </Button>
          </SheetTrigger>
          <SheetTrigger ref={openSheetRef} />
        </div>
        {data && <DataTable columns={columns} data={data} className="h-[700px]" />}
      </div>
      <SheetVoucher id={id} handleClose={handleClose} />
    </Sheet>
  )
}
