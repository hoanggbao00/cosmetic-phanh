"use client"

import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { useCatalogDeleteMutation, useCatalogQuery } from "@/queries/catalog"
import type { Category } from "@/types/tables/categories"
import { Loader2, PlusCircleIcon } from "lucide-react"
import { useRef, useState } from "react"
import { getCatalogColumns } from "./columns"
import SheetCatalog from "./sheet-catalog"

export default function CatalogTable() {
  const { data, isLoading } = useCatalogQuery()
  const openSheetRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState<string | null>(null)

  const { mutate: deleteCatalog } = useCatalogDeleteMutation()

  const handleAdd = () => {
    setId("new")
    setIsOpen(true)
  }

  const handleEdit = (id: string) => {
    setId(id)
    setIsOpen(true)
  }

  const handleClose = (value: boolean) => {
    if (!value) {
      setId(null)
      setIsOpen(false)
    }
  }

  const handleDelete = (id: string) => {
    deleteCatalog(id)
  }

  if (isLoading)
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2">
        <Loader2 className="size-10 animate-spin" />
        <p>Fetching data...</p>
      </div>
    )

  const columns = getCatalogColumns({ onEdit: handleEdit, onDelete: handleDelete })

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <div className="flex size-full flex-col gap-2">
        <div className="flex items-center justify-end">
          <SheetTrigger asChild>
            <Button icon={PlusCircleIcon} iconPlacement="right" size="sm" onClick={handleAdd}>
              Add
            </Button>
          </SheetTrigger>
          <SheetTrigger ref={openSheetRef} />
        </div>
        {data && (
          <DataTable<Category, string> columns={columns} data={data} className="h-[700px]" />
        )}
      </div>
      <SheetCatalog id={id} />
    </Sheet>
  )
}
