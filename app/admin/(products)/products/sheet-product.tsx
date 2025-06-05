import ImagesPicker from "@/components/shared/image-picker"
import Select from "@/components/shared/select"
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
import { slugify } from "@/lib/utils"
import { useBrandQuery } from "@/queries/brand"
import { useCatalogQuery } from "@/queries/catalog"
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
  const { data: brands } = useBrandQuery()
  const { data: catalogs } = useCatalogQuery()

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

  const handleAddImages = (imagesSelected: string[]) => {
    setImages([...imagesSelected])
    form.setValue("images", [...imagesSelected])
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
            <form onSubmit={form.handleSubmit(onSubmit)} id="product-form">
              <div className="flex size-full max-h-[83vh] flex-col gap-4 overflow-y-auto">
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
                  {images.length <= 5 && (
                    <div className="flex gap-4">
                      <ImagesPicker defaultSelectedImages={images} onAddImages={handleAddImages}>
                        <Button variant={"outline"} type="button" size="sm" className="flex-1">
                          Pick Image
                        </Button>
                      </ImagesPicker>
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
                            <Button
                              variant={"outline"}
                              onClick={() => open()}
                              type="button"
                              size="sm"
                              className="flex-1"
                            >
                              Upload an Image
                            </Button>
                          )
                        }}
                      </CldUploadWidget>
                    </div>
                  )}
                </div>
                <InputField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                  disabled={isLoading}
                  onChange={(e) => {
                    form.setValue("name", e.target.value)
                    form.setValue("slug", slugify(e.target.value))
                  }}
                />
                <div className="flex gap-4">
                  <FieldWrapper
                    control={form.control}
                    name="brand_id"
                    label="Brand"
                    parentClassName="flex-1"
                  >
                    {(field) => (
                      <Select
                        options={
                          brands?.map((brand) => ({ label: brand.name, value: brand.id })) || []
                        }
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select brand"
                        disabled={isLoading}
                        className="w-full border-muted-foreground"
                      />
                    )}
                  </FieldWrapper>
                  <FieldWrapper
                    control={form.control}
                    name="category_id"
                    label="Category"
                    parentClassName="flex-1"
                  >
                    {(field) => (
                      <Select
                        options={
                          catalogs?.map((catalog) => ({
                            label: catalog.name,
                            value: catalog.id,
                          })) || []
                        }
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select category"
                        disabled={isLoading}
                        className="w-full border-muted-foreground"
                      />
                    )}
                  </FieldWrapper>
                </div>
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
                    onChange={(e) => {
                      form.setValue("price", Number(e.target.value))
                    }}
                  />
                  <InputField
                    control={form.control}
                    type="number"
                    name="stock_quantity"
                    label="Stock quantity"
                    placeholder="Enter stock quantity"
                    disabled={isLoading}
                    onChange={(e) => {
                      form.setValue("stock_quantity", Number(e.target.value))
                    }}
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
                    onChange={(e) => {
                      form.setValue("weight", Number(e.target.value))
                    }}
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
                        onChange={(e) => {
                          form.setValue("dimensions.width", Number(e.target.value))
                        }}
                      />
                      <InputField
                        control={form.control}
                        type="number"
                        name="dimensions.height"
                        placeholder="Height"
                        disabled={isLoading}
                        onChange={(e) => {
                          form.setValue("dimensions.height", Number(e.target.value))
                        }}
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
              </div>
              <Button
                type="submit"
                className="mt-6 w-full"
                disabled={isLoading}
                form="product-form"
              >
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
