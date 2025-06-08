"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import ImagesPicker from "@/components/shared/image-picker"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CLOUDINARY_UPLOAD_PRESET } from "@/lib/config/app.config"
import { slugify } from "@/lib/utils"
import { useBlogCategories } from "@/queries/blog-categories"
import { useCreateBlogPost, useUpdateBlogPost } from "@/queries/blog-posts"
import { useCreateImage } from "@/queries/images"
import type { BlogPost } from "@/types/tables/blog_posts"
import { ImageIcon } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import { type BlogPostFormValues, blogPostSchema } from "./schema"
import TiptapEditor from "./tiptap-editor"

interface BlogPostFormProps {
  post?: BlogPost
}

function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter()
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || null,
      content: post?.content || "",
      category_id: post?.category_id || null,
      status: post?.status || "draft",
      is_featured: post?.is_featured ?? false,
      tags: post?.tags || null,
      featured_image: post?.featured_image || null,
    },
  })

  const { data: categories } = useBlogCategories()
  const { mutate: createPost } = useCreateBlogPost()
  const { mutate: updatePost } = useUpdateBlogPost()
  const { mutate: createImage } = useCreateImage()

  const onSubmit = (data: BlogPostFormValues) => {
    if (post) {
      updatePost(
        { id: post.id, post: { ...data } },
        {
          onSuccess: () => {
            toast.success("Post updated successfully")
            router.push("/admin/blogs")
          },
          onError: () => {
            toast.error("Failed to update post")
          },
        }
      )
    } else {
      createPost(data, {
        onSuccess: () => {
          toast.success("Post created successfully")
          router.push("/admin/blogs")
        },
        onError: () => {
          toast.error("Failed to create post")
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex w-full gap-4">
          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="space-y-0.5">
                  <FormLabel>Featured</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-1 justify-end">
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <div className="flex items-start gap-4">
                  {field.value ? (
                    <div className="relative aspect-video w-[200px] overflow-hidden rounded-lg border">
                      <img src={field.value} alt="Featured" className="size-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-[200px] items-center justify-center rounded-lg border">
                      <ImageIcon className="text-muted-foreground" size={24} />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <ImagesPicker
                      onAddImages={(images) => field.onChange(images[0] || null)}
                      defaultSelectedImages={field.value ? [field.value] : []}
                    >
                      <Button type="button" variant="outline" size="sm">
                        {field.value ? "Change Image" : "Add Image"}
                      </Button>
                    </ImagesPicker>
                    <CldUploadWidget
                      uploadPreset={CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={(result) => {
                        if (typeof result.info === "object" && "secure_url" in result.info) {
                          createImage({
                            url: result.info.secure_url,
                          })
                          field.onChange(result.info.secure_url)
                        }
                      }}
                    >
                      {({ open }) => {
                        return (
                          <Button variant="outline" onClick={() => open()} type="button" size="sm">
                            Upload New Image
                          </Button>
                        )
                      }}
                    </CldUploadWidget>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    form.setValue("slug", slugify(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TiptapEditor content={field.value} onChange={field.onChange} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blogs")}>
            Cancel
          </Button>
          <Button type="submit">{post ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  )
}

export default BlogPostForm
