"use client"

import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { useCatalogQuery, useDeleteCategory } from "@/queries/catalog"
import type { Category } from "@/types/tables/categories"
import type { ColumnDef } from "@tanstack/react-table"
import { Loader2, PlusCircleIcon } from "lucide-react"
import { useState } from "react"
import { getCatalogColumns } from "./columns"
import SheetCatalog from "./sheet-catalog"

export default function CatalogTable() {
  const { data, isLoading } = useCatalogQuery()
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState<string | null>(null)

  const { mutate: deleteCategory } = useDeleteCategory()

  const handleAdd = () => {
    setId("new")
    setIsOpen(true)
  }

  const handleEdit = (id: string) => {
    setId(id)
    setIsOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setId(null)
  }

  const handleDelete = (id: string) => {
    deleteCategory(id)
  }

  if (isLoading)
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2">
        <Loader2 className="size-10 animate-spin" />
        <p>Fetching data...</p>
      </div>
    )

  const columns = getCatalogColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  }) as ColumnDef<Category>[]

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <div className="flex size-full flex-col gap-2">
        <div className="flex items-center justify-end">
          <SheetTrigger asChild>
            <Button icon={PlusCircleIcon} iconPlacement="right" size="sm" onClick={handleAdd}>
              Add
            </Button>
          </SheetTrigger>
        </div>
        {data && <DataTable columns={columns} data={data} className="h-[700px]" />}
      </div>
      <SheetCatalog id={id} />
    </Sheet>
  )
}
