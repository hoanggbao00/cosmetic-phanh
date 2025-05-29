import { z } from "zod"

export const signUpSchema = z
  .object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export const defaultSignUpValues: SignUpSchema = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export type SignUpSchema = z.infer<typeof signUpSchema>
