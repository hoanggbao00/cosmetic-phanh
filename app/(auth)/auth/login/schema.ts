import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export const defaultLoginValues: LoginSchema = {
  email:
    process.env.NODE_ENV === "development"
      ? (process.env.NEXT_PUBLIC_DEV_DEFAULT_USER_EMAIL as string)
      : "",
  password:
    process.env.NODE_ENV === "development"
      ? (process.env.NEXT_PUBLIC_DEV_DEFAULT_USER_PASSWORD as string)
      : "",
}

export type LoginSchema = z.infer<typeof loginSchema>
