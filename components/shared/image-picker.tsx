import { cn } from "@/lib/utils"
import { useImageQuery } from "@/queries/images"
import { Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

interface ImagesPickerProps {
  children: React.ReactNode
  onAddImages?: (images: string[]) => void
  defaultSelectedImages?: string[]
}

export default function ImagesPicker({
  children,
  onAddImages,
  defaultSelectedImages,
}: ImagesPickerProps) {
  const [open, setOpen] = useState(false)
  const { data: images, isLoading } = useImageQuery({ enabled: open })
  const [selectedImage, setSelectedImage] = useState<string[]>(defaultSelectedImages || [])

  const handleSelectImage = (image: string) => {
    if (selectedImage.includes(image)) {
      setSelectedImage(selectedImage.filter((i) => i !== image))
    } else {
      setSelectedImage([...selectedImage, image])
    }
  }

  const handleAddImages = () => {
    if (selectedImage.length > 0) {
      onAddImages?.(selectedImage)
    } else {
      onAddImages?.([])
    }
  }

  useEffect(() => {
    if (open) {
      setSelectedImage(defaultSelectedImages || [])
    }
  }, [open, defaultSelectedImages])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader className="items-center gap-2 sm:flex-row">
          <DialogTitle>Image Pickers</DialogTitle>
          {selectedImage.length > 0 && (
            <DialogDescription className="text-sm">
              ({selectedImage.length} selected)
            </DialogDescription>
          )}
        </DialogHeader>
        {isLoading && (
          <div className="flex size-full items-center justify-center">
            <Loader2Icon className="animate-spin" size={48} />
          </div>
        )}
        {images && (
          <div className="grid max-h-[500px] grid-cols-4 gap-2 overflow-y-auto">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  "aspect-square w-full overflow-hidden rounded-md",
                  selectedImage.includes(image.url) && "border border-accent p-1"
                )}
                onClick={() => handleSelectImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={`image-${index}`}
                  className="size-full rounded-md object-cover"
                />
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="sm" onClick={handleAddImages}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
