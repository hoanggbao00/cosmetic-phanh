"use client"

import { StarIcon } from "@/assets/icons/star-icon"
import { SpecialButton } from "@/components/shared/special-button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useCatalogQuery } from "@/queries/catalog"
import Link from "next/link"
import { CategoryList } from "./category-list"

export function SectionCategory() {
  const { data: categories = [], isLoading } = useCatalogQuery()

  // Take only first 15 categories
  const displayCategories = categories.slice(0, 15).map((category) => category.name)

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-background px-4 py-16" id="scroll-down-section">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Title */}
        <div className="flex flex-col items-center">
          <div className="mb-2 flex items-center gap-2">
            <StarIcon className="animate-spin text-primary" />
            <span className="text-gray-700 text-sm">Dermatologist-Approved</span>
          </div>
          <h2 className="font-semibold font-serif text-4xl text-primary md:text-5xl">
            Luxurious Products
          </h2>
        </div>

        {/* Categories */}
        <CategoryList categories={displayCategories} />

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/catalog">
            <SpecialButton>View All Categories</SpecialButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
