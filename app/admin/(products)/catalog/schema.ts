import { z } from "zod"

export const catalogSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
})

export const defaultCatalogValues: Catalog = {
  name: "",
  slug: "",
  description: "",
}

export type Catalog = z.infer<typeof catalogSchema>
