import * as z from "zod"

export const orderSchema = z.object({
  order_number: z.string(),
  guest_email: z.string().nullable(),
  status: z.string({ message: "Status is required" }).min(1, { message: "Status is required" }),
  payment_status: z
    .string({ message: "Payment status is required" })
    .min(1, { message: "Payment status is required" }),
  payment_method: z
    .string({ message: "Payment method is required" })
    .min(1, { message: "Payment method is required" }),
  shipping_amount: z.number(),
  discount_amount: z.number(),
  total_amount: z.number(),
  shipping_address: z.object({
    full_name: z.string().min(1, { message: "Full name is required" }),
    address_line1: z.string().min(1, { message: "Address line 1 is required" }),
    address_line2: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    phone: z.string().min(1, { message: "Phone is required" }),
  }),
  order_items: z.array(
    z.object({
      product_id: z.string(),
      product_name: z.string(),
      variant_id: z.string().optional(),
      variant_name: z.string().optional(),
      variant_price: z.number(),
      price: z.number(),
      quantity: z.number(),
      total_price: z.number(),
    })
  ),
  customer_notes: z.string(),
  admin_notes: z.string(),
})

export type OrderSchema = z.infer<typeof orderSchema>
