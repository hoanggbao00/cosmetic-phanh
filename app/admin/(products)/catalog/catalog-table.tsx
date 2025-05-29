"use client"

import { DataTable } from "@/components/shared/data-table"
import DefaultHeader from "@/components/shared/data-table/default-header"
import { Checkbox } from "@/components/ui/checkbox"
import { useCatalogQuery } from "@/queries/catalog"
import type { Category } from "@/types/tables/categories"
import { createColumnHelper } from "@tanstack/react-table"
import { Loader2 } from "lucide-react"

const columnHelper = createColumnHelper<Category>()

const columns = [
  columnHelper.display({
    id: "action",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
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
]

export default function CatalogTable() {
  const { data, isLoading } = useCatalogQuery()

  if (isLoading)
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2">
        <Loader2 className="size-10 animate-spin" />
        <p>Fetching data...</p>
      </div>
    )

  return (
    <div className="flex size-full items-center justify-center">
      {data && <DataTable<Category, string> columns={columns} data={data} className="h-[800px]" />}
    </div>
  )
}
