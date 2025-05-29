import {} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import type { ComponentProps } from "react"
import UserDropdown from "./user-dropdown"

interface PrivateLayoutProps extends ComponentProps<"div"> {
  parentBreadcrumb: {
    title: string
    href: string
  }
  currentBreadcrumb: string
  title?: string
}

export default async function PrivateLayout({
  children,
  parentBreadcrumb,
  currentBreadcrumb,
  className,
  title,
  ...props
}: PrivateLayoutProps) {
  const supabase = await createSupabaseServerClient()
  const { data: session } = await supabase.auth.getUser()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={parentBreadcrumb.href}>{parentBreadcrumb.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentBreadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          {session.user?.user_metadata && (
            <UserDropdown
              user={{
                email: session.user?.email || "",
                full_name: session.user?.user_metadata.full_name || "",
              }}
            />
          )}
        </div>
      </header>
      <div className={cn("flex min-h-0 flex-1 flex-col gap-4 p-4", className)} {...props}>
        {title && <h2 className="font-bold text-2xl">{title}</h2>}
        {children}
      </div>
    </>
  )
}
