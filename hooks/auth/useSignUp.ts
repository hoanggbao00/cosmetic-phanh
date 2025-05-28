"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSignUp({
    email,
    password,
    fullName,
    callbackUrl,
  }: { email: string; password: string; fullName: string; callbackUrl?: string }) {
    setLoading(true);

    // Đăng ký tài khoản với Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Sau khi đăng ký, tạo bản ghi profile
    if (data.user) {
      const res = await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "user",
      });

      if (res.error) {
        toast.error(res.error.message);
        setLoading(false);
        return;
      }

      if (callbackUrl) {
        router.push(callbackUrl);
      }
    }

    setLoading(false);
  }

  return { handleSignUp, loading };
};
