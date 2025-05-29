import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  stock_quantity: z.number().optional(),
  weight: z.number().optional(),
  dimensions: z
    .object({
      width: z.number().min(0),
      height: z.number().min(0),
    })
    .optional(),
  ingredients: z.string().optional(),
  how_to_use: z.string().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  brand_id: z.string().optional(),
  category_id: z.string().optional(),
})

export type ProductSchema = z.infer<typeof productSchema>

export const defaultProductValues: ProductSchema = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  stock_quantity: 0,
  weight: 0,
  dimensions: {
    width: 0,
    height: 0,
  },
  ingredients: "",
  how_to_use: "",
  is_active: true,
  is_featured: false,
  images: [],
  brand_id: "",
  category_id: "",
}
