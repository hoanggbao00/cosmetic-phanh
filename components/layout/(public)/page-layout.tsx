import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export default function PageLayout({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("pt-28", className)} {...props} />
}
