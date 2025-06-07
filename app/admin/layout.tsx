import { AppSidebar } from "@/components/layout/private/app-sidebar"
import QueryProvider from "@/components/providers/query-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()

  // Lấy user từ session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("Admin layout - Session error:", sessionError)
    redirect("/auth/login")
  }

  if (!session) {
    console.error("Admin layout - No session found")
    redirect("/auth/login")
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error("Admin layout - User error:", userError)
    redirect("/auth/login")
  }

  if (!user) {
    console.error("Admin layout - No user found")
    redirect("/auth/login")
  }

  // Lấy role từ profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("Admin layout - Profile error:", profileError)
    redirect("/auth/login")
  }

  // Không phải admin, redirect về login
  if (!profile || profile.role !== "admin") {
    console.error("Admin layout - User is not admin:", profile)
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
