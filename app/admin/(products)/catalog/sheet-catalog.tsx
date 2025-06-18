"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/ui/form-fields/input-field"
import { SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useCatalogQueryById, useCreateCategory, useUpdateCategory } from "@/queries/catalog"
import type { CategoryInsert } from "@/types/tables/categories"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import type { Catalog } from "./schema"
import { catalogSchema, defaultCatalogValues } from "./schema"

export default function SheetCatalog({ id }: { id: string | null }) {
  const isEdit = id !== "new"
  const closeSheetRef = useRef<HTMLButtonElement>(null)

  const form = useForm<Catalog>({
    resolver: zodResolver(catalogSchema),
    defaultValues: defaultCatalogValues,
  })

  const { data: detailCatalog } = useCatalogQueryById(id)
  const { mutate: createCatalog, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCatalog, isPending: isUpdating } = useUpdateCategory()

  const isLoading = isCreating || isUpdating

  const onSubmit = (data: Catalog) => {
    const categoryData: CategoryInsert = {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
    }

    if (!isEdit) {
      createCatalog(categoryData)
      return
    }

    updateCatalog({ id: id!, category: categoryData })
  }

  useEffect(() => {
    if (id === "new") {
      form.reset(defaultCatalogValues)
      return
    }

    if (detailCatalog) {
      form.reset({
        name: detailCatalog.name,
        slug: detailCatalog.slug,
        description: detailCatalog.description || "",
      })
    }
  }, [detailCatalog, form, id])

  return (
    <SheetContent>
      <SheetTitle>{isEdit ? "Edit catalog" : "Create catalog"}</SheetTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 max-h-[calc(100vh-10rem)] space-y-4 overflow-y-auto"
        >
          <InputField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Enter category name"
          />

          <InputField
            control={form.control}
            name="slug"
            label="Slug"
            placeholder="Enter category slug"
          />

          <InputField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter category description"
          />

          <div className="flex justify-end gap-4">
            <SheetClose ref={closeSheetRef} asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  )
}
