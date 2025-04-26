"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products } from "@/lib/data-product";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FilterPanel } from "./filter-pannel";
import { ProductCard } from "./product-card";

export default function CatalogPageView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const maxPrice = Math.max(...products.map((product) => product.price));

  const filters = useMemo(() => {
    const categories = searchParams.get("categories")?.split(",") ?? [];
    const priceFrom = Number(searchParams.get("priceFrom")) ?? 0;
    const priceTo = Number(searchParams.get("priceTo")) ?? maxPrice;
    const colors = searchParams.get("colors")?.split(",") ?? [];

    return { categories, priceFrom, priceTo, colors };
  }, [searchParams, maxPrice]);

  // Sort state
  const [sortOption, setSortOption] = useState("featured");

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (filters.categories.length > 0 && !filters.categories.some((c) => product.category.includes(c))) {
      return false;
    }

    // Filter by price
    if (product.price < filters.priceFrom && product.price > filters.priceTo) {
      return false;
    }

    // Filter by color
    if (filters.colors.length > 0 && !filters.colors.some((c) => product.colors?.includes(c))) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "name-a-z":
        return a.name.localeCompare(b.name);
      case "name-z-a":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("categories");
    params.delete("priceFrom");
    params.delete("priceTo");
    params.delete("colors");
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">Product Catalog</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filter Sidebar */}
        <FilterPanel />

        {/* Products Section */}
        <div className="flex-1">
          {/* Sort and Results Count */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-gray-500 text-sm">
              Showing {sortedProducts.length} of {products.length} products
            </p>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="mr-2 text-sm">Sort by:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                  <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No products match your filters.</p>
              <Button variant="link" onClick={resetFilters} className="mt-2">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
