import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { HeaderContext } from "@tanstack/react-table"
import { ArrowDownAZ, ArrowUpZA } from "lucide-react"

interface DefaultHeaderProps<T> {
  info: HeaderContext<T, T>
  name: string
}

export function DefaultHeader<TValue>({ info, name }: DefaultHeaderProps<TValue>) {
  "use no memo"
  const { table } = info
  const sorted = info.column.getIsSorted()

  return (
    <ContextMenu>
      <ContextMenuTrigger
        onPointerDown={(e) => {
          e.preventDefault()
          if (e.button === 2) return
          info.column.toggleSorting(info.column.getIsSorted() === "asc")
        }}
        className="flex h-full w-full cursor-default flex-row items-center justify-start gap-1"
      >
        {name}
        {sorted === "asc" && <ArrowDownAZ size="14" className="text-muted-foreground" />}
        {sorted === "desc" && <ArrowUpZA size="14" className="text-muted-foreground" />}
      </ContextMenuTrigger>
      <ContextMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <ContextMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </ContextMenuCheckboxItem>
          ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default DefaultHeader
