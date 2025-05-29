import { AppSidebar } from "@/components/layout/private/app-sidebar"
import QueryProvider from "@/components/providers/query-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()

  // Lấy user từ session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Nếu chưa đăng nhập -> chuyển về trang login
    redirect("/auth/login")
  }

  // Lấy role từ profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // Không phải admin, redirect về login
  if (!profile || profile.role !== "admin") {
    redirect("/auth/login")
  }

  // Nếu hợp lệ, render dashboard
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <QueryProvider>{children}</QueryProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
