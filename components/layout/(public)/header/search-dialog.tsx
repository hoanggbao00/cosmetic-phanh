"use client"

import { SymbolIcon } from "@/assets/icons/symbol-icon"
import { FadeUpContainer, FadeUpItem } from "@/components/motion/fade-up"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"
import { useSearchProducts } from "@/queries/product"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from "usehooks-ts"

export default function SearchDialog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 500)
  const { data: foundProducts, isLoading } = useSearchProducts(debouncedSearchQuery)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer transition-colors duration-300 hover:text-primary">
          <SearchIcon className="size-4 md:size-6" />
        </div>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="p-2 sm:max-w-4xl">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search for products</DialogDescription>
        <Input
          type="text"
          placeholder="Search"
          endIcon={SearchIcon}
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {debouncedSearchQuery && !isLoading && foundProducts && (
          <div className="max-h-[50vh] overflow-y-auto">
            <p className="px-2 text-muted-foreground text-xs">
              {foundProducts.length} {foundProducts.length === 1 ? "product" : "products"} found
            </p>
            <FadeUpContainer className="flex flex-col px-2" delay={0.05}>
              {foundProducts.map((product) => (
                <FadeUpItem key={product.slug}>
                  <DialogClose asChild>
                    <Link
                      href={`/product/${product.slug}`}
                      className="group relative flex items-center gap-2 rounded-md p-2 transition-colors duration-300 hover:bg-accent"
                      key={product.id}
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="aspect-square rounded-md bg-secondary object-cover"
                      />
                      <img
                        width={50}
                        height={50}
                        src={product.images?.[1] || product.images?.[0]}
                        alt={product.name}
                        className="absolute inset-2 aspect-square rounded-md bg-secondary object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <div className="flex flex-col gap-1">
                        <p>{product.name}</p>
                        <p>{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  </DialogClose>
                </FadeUpItem>
              ))}
            </FadeUpContainer>
          </div>
        )}

        {isLoading && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-primary">
            <SymbolIcon className="size-4 animate-spin" />
            <p>Searching for {debouncedSearchQuery}...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
