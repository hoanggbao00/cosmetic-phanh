import DefaultHeader from "@/components/shared/data-table/default-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import type { Brand } from "@/types/tables/brands"
import type { Category } from "@/types/tables/categories"
import type { Product } from "@/types/tables/products"
import { createColumnHelper } from "@tanstack/react-table"
import { EditIcon, MoreVertical, TrashIcon } from "lucide-react"

const columnHelper = createColumnHelper<Product>()

interface GetProductColumnsProps {
  catalogData: Category[]
  brandData: Brand[]

  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
  onToggleFeatured: (id: string, isFeatured: boolean) => void
}

export const getProductColumns = ({
  catalogData,
  brandData,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
}: GetProductColumnsProps) => {
  return [
    columnHelper.accessor("images", {
      header: (info) => <DefaultHeader info={info} name="Images" />,
      cell: (info) => {
        const images = info.getValue() ?? []
        if (images.length === 0) return "No image"
        return (
          <div className="size-12 overflow-hidden rounded-md bg-white">
            <img
              key={images[0]}
              src={images[0]}
              alt="Product"
              className="size-full rounded-md object-cover"
            />
          </div>
        )
      },
    }),
    columnHelper.accessor("name", {
      header: (info) => <DefaultHeader info={info} name="Name" />,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("is_active", {
      header: (info) => <DefaultHeader info={info} name="Active" />,
      cell: (info) => {
        const isActive = info.getValue() ?? false
        const handleChange = () => {
          onToggleActive(info.row.original.id, !isActive)
        }

        return <Switch checked={isActive} onCheckedChange={handleChange} />
      },
    }),
    columnHelper.accessor("is_featured", {
      header: (info) => <DefaultHeader info={info} name="Featured" />,
      cell: (info) => {
        const isFeatured = info.getValue() ?? false
        const handleChange = () => {
          onToggleFeatured(info.row.original.id, !isFeatured)
        }

        return <Switch checked={isFeatured} onCheckedChange={handleChange} />
      },
    }),
    columnHelper.accessor("brand_id", {
      header: (info) => <DefaultHeader info={info} name="Brand" />,
      cell: (info) => {
        const brandId = info.getValue()
        const brand = brandData?.find((b) => b.id === brandId)
        return brand?.name
      },
    }),
    columnHelper.accessor("category_id", {
      header: (info) => <DefaultHeader info={info} name="Category" />,
      cell: (info) => {
        const categoryId = info.getValue()
        const category = catalogData?.find((c) => c.id === categoryId)
        return category?.name
      },
    }),
    columnHelper.accessor("price", {
      header: (info) => <DefaultHeader info={info} name="Price" />,
      cell: (info) => `${info.getValue().toLocaleString("vi-VN")} ₫`,
    }),
    columnHelper.accessor("stock_quantity", {
      header: (info) => <DefaultHeader info={info} name="In Stock" />,
      cell: (info) => `${info.getValue()}`,
    }),
    columnHelper.display({
      id: "more",
      cell: ({ row }) => {
        const product = row.original

        const handleEdit = () => {
          onEdit(product.id)
        }

        const handleDelete = () => {
          onDelete(product.id)
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="h-8 w-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className=""
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel className="">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}>
                <EditIcon /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant={"destructive"} onClick={handleDelete}>
                <TrashIcon /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ]
}
