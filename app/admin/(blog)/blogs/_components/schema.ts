import z from "zod"

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().nullable(),
  content: z.string().min(1, "Content is required"),
  category_id: z.string().nullable(),
  status: z.string().default("draft"),
  is_featured: z.boolean().default(false),
  tags: z.array(z.string()).nullable(),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>
