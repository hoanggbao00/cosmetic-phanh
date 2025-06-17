"use client"

import { FadeUpContainer, FadeUpItem } from "@/components/motion/fade-up"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useCatalogQuery } from "@/queries/catalog"
import { useProductQuery } from "@/queries/product"
import type { Product } from "@/types/tables/products"
import { DEFAULT_SORT_OPTION } from "../const"
import { ClearFilter } from "./clear-filter"
import { FilterPanel } from "./filter-pannel"
import { ProductCard } from "./product-card"
import { SortSection } from "./sort-section"

export type FilterAndSortParams = {
  categories?: string
  priceFrom?: string
  priceTo?: string
  brands?: string
  sort?: string
}

interface Props {
  searchParams: FilterAndSortParams
}

export default function CatalogPageView({ searchParams }: Props) {
  const { data: products = [], isLoading: isLoadingProducts } = useProductQuery()
  const { data: categories = [] } = useCatalogQuery()

  const maxPrice =
    products.length > 0 ? Math.max(...products.map((product) => product.price)) : 1000

  const sortOption = searchParams.sort ?? DEFAULT_SORT_OPTION

  const filters = {
    categories: searchParams.categories?.split(",") ?? [],
    priceFrom: Number(searchParams.priceFrom) ?? 0,
    priceTo: Number(searchParams.priceTo) ?? maxPrice,
    brands: searchParams.brands?.split(",") ?? [],
  }

  // Filter products
  const filteredProducts = products.filter((product: Product) => {
    // Filter by category
    if (
      filters.categories.length > 0 &&
      !filters.categories.some((c) => product.category_id === c)
    ) {
      return false
    }

    // Filter by price
    if (product.price < filters.priceFrom || product.price > filters.priceTo) {
      return false
    }

    // Filter by variants
    if (filters.brands.length > 0) {
      const productBrand = product.brand_id
      if (!filters.brands.includes(productBrand)) {
        return false
      }
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return a.price - b.price
      case "price-high-low":
        return b.price - a.price
      case "name-a-z":
        return a.name.localeCompare(b.name)
      case "name-z-a":
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  if (isLoadingProducts) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">Product Catalog</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filter Sidebar */}
        <FilterPanel categories={categories} />

        {/* Products Section */}
        <div className="flex-1">
          {/* Sort and Results Count */}
          <SortSection />

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <FadeUpContainer
              className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
              stagger={0.1}
            >
              {sortedProducts.map((product) => (
                <FadeUpItem key={product.id}>
                  <ProductCard product={product} categories={categories} />
                </FadeUpItem>
              ))}
            </FadeUpContainer>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No products match your filters.</p>
              <ClearFilter searchParams={searchParams} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
