import * as z from "zod"

export const orderSchema = z.object({
  order_number: z.string().optional(),
  guest_email: z.string().nullable(),
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  payment_status: z.enum(["pending", "paid", "failed", "refunded", "partially_refunded"]),
  payment_method: z.enum(["cash", "card", "bank_transfer"]),
  shipping_amount: z.number(),
  discount_amount: z.number(),
  total_amount: z.number(),
  shipping_address: z.object({
    full_name: z.string(),
    address_line1: z.string(),
    address_line2: z.string().optional(),
    city: z.string(),
    phone: z.string(),
  }),
  order_items: z.array(
    z.object({
      product_id: z.string(),
      product_name: z.string(),
      variant_id: z.string().optional(),
      variant_name: z.string().optional(),
      price: z.number(),
      quantity: z.number(),
      total_price: z.number(),
      variant_price: z.number().optional(),
    })
  ),
  customer_notes: z.string(),
  admin_notes: z.string(),
  voucher_id: z.string().optional(),
  voucher_code: z.string().optional(),
})

export type OrderFormValues = z.infer<typeof orderSchema>
