"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"
import { useProductQuery } from "@/queries/product"
import { useDeleteProductVariant, useProductVariantsQuery } from "@/queries/product-variants"
import type { ProductVariant } from "@/types/tables/product_variants"
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react"
import ProductVariantDialog from "./product-variant-dialog"

export default function ProductVariantsTable() {
  const { data: variants, isLoading } = useProductVariantsQuery()
  const { data: products } = useProductQuery()
  const { mutate: deleteVariant } = useDeleteProductVariant()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const handleEdit = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      deleteVariant(id)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Old Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants?.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>{variant.name}</TableCell>
                <TableCell>
                  {products?.find((product) => product.id === variant.product_id)?.name}
                </TableCell>
                <TableCell>{formatPrice(variant.price)}</TableCell>
                <TableCell>{variant.old_price ? formatPrice(variant.old_price) : "-"}</TableCell>
                <TableCell>{variant.stock_quantity}</TableCell>
                <TableCell>{variant.is_active ? "Active" : "Inactive"}</TableCell>
                <TableCell className="flex justify-end">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(variant)}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(variant.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductVariantDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        variant={selectedVariant}
        onClose={() => {
          setSelectedVariant(null)
          setShowDialog(false)
        }}
      />
    </div>
  )
}
