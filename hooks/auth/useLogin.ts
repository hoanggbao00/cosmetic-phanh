import type { LoginSchema } from "@/app/(auth)/auth/login/schema"
import { supabase } from "@/utils/supabase/client"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"
import { toast } from "sonner"

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  async function handleLogin({ email, password }: LoginSchema) {
    setLoading(true)

    // Đăng nhập với Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoading(false)
      toast.error(error.message)
      return
    }

    // Lấy thông tin role từ bảng profiles
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        toast.error("User role not found.")
        setLoading(false)
        return
      }

      if (profile?.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/")
      }
    } else {
      toast.error("User has not registered.")
    }

    setLoading(false)
  }

  return { handleLogin, loading }
}
