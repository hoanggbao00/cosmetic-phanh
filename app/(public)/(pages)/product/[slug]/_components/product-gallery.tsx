"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImage(index)
  }

  const openZoom = (image: string) => {
    setZoomImage(image)
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[currentImage] || "/placeholder.svg"}
          alt={`${productName} - Image ${currentImage + 1}`}
          fill
          className="object-contain"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="-translate-y-1/2 absolute top-1/2 left-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white/90"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="-translate-y-1/2 absolute top-1/2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white/90"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white/90"
              onClick={() => openZoom(images[currentImage])}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom image</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] w-[90vw] max-w-4xl overflow-hidden p-0">
            <div className="relative h-[80vh] w-full">
              <Image
                src={zoomImage || images[currentImage]}
                alt={`${productName} - Zoomed Image`}
                fill
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              type="button"
              key={index}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md ${
                currentImage === index ? "ring-2 ring-primary" : "ring-1 ring-gray-200"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
