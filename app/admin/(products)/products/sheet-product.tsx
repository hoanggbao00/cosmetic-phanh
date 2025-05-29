import { Button } from "@/components/ui/button"
import { Form, FormLabel } from "@/components/ui/form"
import { FieldWrapper } from "@/components/ui/form-fields/field-wrapper"
import { InputField } from "@/components/ui/form-fields/input-field"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CLOUDINARY_UPLOAD_PRESET } from "@/lib/config/app.config"
import { useImageCreateMutation } from "@/queries/images"
import {
  useProductCreateMutation,
  useProductQueryById,
  useProductUpdateMutation,
} from "@/queries/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, XIcon } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import type { ProductSchema } from "./schema"
import { defaultProductValues, productSchema } from "./schema"

export default function SheetProduct({
  id,
  handleClose,
}: { id: string | null; handleClose: () => void }) {
  const isEdit = id !== "new"
  const title = isEdit ? "Edit product" : "Create product"

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  })
  const [images, setImages] = useState<string[]>([])

  const { data: detailProduct, isLoading: isLoadingDetail } = useProductQueryById(id)
  const { mutate: createProduct, isPending: isCreating } = useProductCreateMutation(handleClose)
  const { mutate: updateProduct, isPending: isUpdating } = useProductUpdateMutation(handleClose)
  const { mutate: createImage } = useImageCreateMutation()

  const isLoading = isCreating || isUpdating

  const onSubmit = (data: ProductSchema) => {
    if (!isEdit) {
      createProduct(data)
      return
    }

    updateProduct({ id: id!, ...data })
  }

  const handleDeleteImage = (image: string) => {
    const images = form.watch("images") || []
    form.setValue(
      "images",
      images.filter((img) => img !== image)
    )
    setImages(images.filter((img) => img !== image))
  }

  useEffect(() => {
    if (id === "new") {
      form.reset(defaultProductValues)
      return
    }

    if (detailProduct) {
      form.reset(detailProduct)
    }
  }, [detailProduct, form, id])

  return (
    <SheetContent className="p-4" onClose={handleClose}>
      <SheetTitle>{title}</SheetTitle>
      <Separator />
      {!isLoadingDetail ? (
        <div className="size-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex size-full flex-col gap-4">
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image) => (
                    <div
                      key={image}
                      className="relative aspect-square w-full rounded-md border border-accent"
                    >
                      <img src={image} alt="Product" className="h-full w-full object-contain" />
                      <div
                        onClick={() => handleDeleteImage(image)}
                        className="-right-2 -top-2 absolute rounded-full border bg-background p-0.5 hover:bg-accent"
                      >
                        <XIcon size={8} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button variant={"outline"} type="button" size="sm">
                    Choose Uploaded Image
                  </Button>
                  <CldUploadWidget
                    uploadPreset={CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result) => {
                      if (typeof result.info === "object" && "secure_url" in result.info) {
                        createImage({
                          url: result.info.secure_url,
                        })
                        setImages([...images, result.info.secure_url])
                        form.setValue("images", [...images, result.info.secure_url])
                      }
                    }}
                  >
                    {({ open }) => {
                      return (
                        <Button variant={"outline"} onClick={() => open()} type="button" size="sm">
                          Upload an Image
                        </Button>
                      )
                    }}
                  </CldUploadWidget>
                </div>
              </div>
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
              <InputField
                control={form.control}
                name="ingredients"
                label="Ingredients"
                placeholder="Enter ingredients"
                disabled={isLoading}
              />
              <div className="flex gap-4">
                <InputField
                  control={form.control}
                  type="number"
                  name="price"
                  label="Price"
                  placeholder="Enter price"
                  disabled={isLoading}
                />
                <InputField
                  control={form.control}
                  type="number"
                  name="stock_quantity"
                  label="Stock quantity"
                  placeholder="Enter stock quantity"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-4">
                <InputField
                  control={form.control}
                  type="number"
                  name="weight"
                  label="Weight"
                  placeholder="Enter weight"
                  disabled={isLoading}
                  parentClassName="flex-1"
                />
                <div className="flex-1">
                  <FormLabel className="mb-2">Dimensions</FormLabel>
                  <div className="flex items-center gap-2">
                    <InputField
                      control={form.control}
                      type="number"
                      name="dimensions.width"
                      placeholder="Width"
                      disabled={isLoading}
                    />
                    <InputField
                      control={form.control}
                      type="number"
                      name="dimensions.height"
                      placeholder="Height"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              <FieldWrapper control={form.control} name="how_to_use" label="How to use">
                {(field) => (
                  <Textarea
                    placeholder="Enter how to use"
                    disabled={isLoading}
                    {...field}
                    className="max-h-24 resize-none"
                  />
                )}
              </FieldWrapper>
              <FieldWrapper control={form.control} name="is_active" label="Is active">
                {(field) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                )}
              </FieldWrapper>

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
