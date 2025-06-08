"use client"

import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { useBrandQuery } from "@/queries/brand"
import { useCatalogQuery } from "@/queries/catalog"
import { useDeleteProduct, useProductQuery, useUpdateProduct } from "@/queries/product"
import type { Product } from "@/types/tables/products"
import type { ColumnDef } from "@tanstack/react-table"
import { Loader2, PlusCircleIcon } from "lucide-react"
import { useRef, useState } from "react"
import { getProductColumns } from "./columns"
import SheetProduct from "./sheet-product"

export default function ProductTable() {
  const { data, isLoading } = useProductQuery()
  const { data: catalogData } = useCatalogQuery()
  const { data: brandData } = useBrandQuery()

  const openSheetRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState<string | null>(null)

  const { mutate: deleteProduct } = useDeleteProduct()
  const { mutate: updateProduct } = useUpdateProduct()

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
    deleteProduct(id)
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateProduct({ id, product: { is_active: isActive } })
  }

  const handleToggleFeatured = (id: string, isFeatured: boolean) => {
    updateProduct({ id, product: { is_featured: isFeatured } })
  }

  if (isLoading)
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2">
        <Loader2 className="size-10 animate-spin" />
        <p>Fetching data...</p>
      </div>
    )

  const columns = getProductColumns({
    catalogData: catalogData || [],
    brandData: brandData || [],
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleActive: handleToggleActive,
    onToggleFeatured: handleToggleFeatured,
  }) as ColumnDef<Product>[]

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
      <SheetProduct id={id} handleClose={handleClose} />
    </Sheet>
  )
}
