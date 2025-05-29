import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/ui/form-fields/input-field"
import { SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  useCatalogCreateMutation,
  useCatalogQueryById,
  useCatalogUpdateMutation,
} from "@/queries/catalog"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import type { Catalog } from "./schema"
import { catalogSchema, defaultCatalogValues } from "./schema"

export default function SheetCatalog({ id }: { id: string | null }) {
  const isEdit = id !== "new"
  const title = isEdit ? "Edit catalog" : "Create catalog"
  const closeSheetRef = useRef<HTMLButtonElement>(null)

  const form = useForm<Catalog>({
    resolver: zodResolver(catalogSchema),
    defaultValues: defaultCatalogValues,
  })

  const handleClose = () => {
    closeSheetRef.current?.click()
  }

  const { data: detailCatalog, isLoading: isLoadingDetail } = useCatalogQueryById(id)
  const { mutate: createCatalog, isPending: isCreating } = useCatalogCreateMutation(handleClose)
  const { mutate: updateCatalog, isPending: isUpdating } = useCatalogUpdateMutation(handleClose)

  const isLoading = isCreating || isUpdating

  const onSubmit = (data: Catalog) => {
    if (!isEdit) {
      createCatalog(data)
      return
    }

    updateCatalog({ id: id!, ...data })
  }

  useEffect(() => {
    if (id === "new") {
      form.reset()
      return
    }

    if (detailCatalog) {
      form.reset(detailCatalog)
    }
  }, [detailCatalog, form, id])

  return (
    <SheetContent className="p-4">
      <SheetClose ref={closeSheetRef} />
      <SheetTitle>{title}</SheetTitle>
      {!isLoadingDetail ? (
        <div className="size-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex size-full flex-col gap-4">
              <InputField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter name"
                disabled={isLoading}
              />
              <InputField
                control={form.control}
                name="slug"
                label="Slug"
                placeholder="Enter slug"
                disabled={isLoading}
              />
              <InputField
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter description"
                disabled={isLoading}
              />

              {/* Submit */}
              <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
                {isLoading && <Loader2Icon className="size-4 animate-spin" />}
                {isEdit ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="flex size-full items-center justify-center">
          <Loader2Icon className="size-10 animate-spin" />
        </div>
      )}
    </SheetContent>
  )
}
