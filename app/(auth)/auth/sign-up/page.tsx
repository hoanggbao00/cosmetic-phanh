"use client"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/ui/form-fields/input-field"
import { useSignUp } from "@/hooks/auth/useSignUp"
import { APP_NAME } from "@/lib/config/app.config"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, LockIcon, MailIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { type SignUpSchema, defaultSignUpValues, signUpSchema } from "./schema"

export default function SignUpPage() {
  const form = useForm<SignUpSchema>({
    defaultValues: defaultSignUpValues,
    resolver: zodResolver(signUpSchema),
  })

  const { handleSignUp, loading } = useSignUp()

  const onSubmit = async (data: SignUpSchema) => {
    await handleSignUp({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      callbackUrl: "/auth/login",
    })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid h-full w-full p-4 lg:grid-cols-2">
        <div className="m-auto flex w-full max-w-xs flex-col items-center">
          <p className="mt-4 mb-6 text-center font-bold text-xl tracking-tight">
            Sign up to <br /> {APP_NAME}
          </p>

          <Form {...form}>
            <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <InputField
                control={form.control}
                name="fullName"
                label="Name"
                placeholder="Name"
                startIcon={UserIcon}
              />

              <InputField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                startIcon={MailIcon}
              />

              <InputField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Password"
                startIcon={LockIcon}
                type="password"
              />

              <InputField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm Password"
                startIcon={LockIcon}
                type="password"
              />

              <Button type="submit" className="mt-4 w-full" disabled={loading}>
                {loading ? <Loader2Icon className="animate-spin" /> : "Sign up"}
              </Button>
            </form>
          </Form>

          <div className="mt-5 space-y-5">
            <p className="text-center text-sm">
              Already have an account?
              <Link href="/auth/login" className="ml-1 text-muted-foreground underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden rounded-lg bg-muted lg:block" />
      </div>
    </div>
  )
}
