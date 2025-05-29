import DefaultHeader from "@/components/shared/data-table/default-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Category } from "@/types/tables/categories"
import { createColumnHelper } from "@tanstack/react-table"
import { EditIcon, MoreVertical, TrashIcon } from "lucide-react"

const columnHelper = createColumnHelper<Category>()

interface GetCatalogColumnsProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const getCatalogColumns = ({ onEdit, onDelete }: GetCatalogColumnsProps) => {
  return [
    columnHelper.display({
      id: "action",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("name", {
      header: (info) => <DefaultHeader info={info} name="Name" />,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("slug", {
      header: (info) => <DefaultHeader info={info} name="Slug" />,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("created_at", {
      header: (info) => <DefaultHeader info={info} name="Created At" />,
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.display({
      id: "more",
      cell: ({ row }) => {
        const category = row.original

        const handleEdit = () => {
          onEdit(category.id)
        }

        const handleDelete = () => {
          onDelete(category.id)
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
