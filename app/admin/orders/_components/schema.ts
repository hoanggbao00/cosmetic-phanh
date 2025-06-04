import { z } from "zod"

export const orderItemSchema = z.object({
  product_id: z.string().optional(),
  variant_id: z.string().optional(),
  product_name: z.string().min(1, "Product name is required"),
  variant_name: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  total_price: z.number().min(0, "Total price must be positive"),
})

export const orderSchema = z.object({
  order_number: z.string().min(1, "Order number is required"),
  guest_email: z.string().email().nullable(),
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
  shipping_amount: z.number().min(0, "Shipping amount must be positive"),
  discount_amount: z.number().min(0, "Discount amount must be positive"),
  total_amount: z.number().min(0, "Total amount must be positive"),
  shipping_address: z.object({
    full_name: z.string().min(1, "Full name is required"),
    address_line1: z.string().min(1, "Address line 1 is required"),
    address_line2: z.string().nullable(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().nullable(),
  }),
  order_items: z.array(orderItemSchema).optional(),
  customer_notes: z.string().nullable(),
  admin_notes: z.string().nullable(),
})

export type OrderSchema = z.infer<typeof orderSchema>
