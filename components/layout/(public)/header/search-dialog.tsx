"use client";

import { SymbolIcon } from "@/assets/icons/symbol-icon";
import { FadeUpContainer, FadeUpItem } from "@/components/motion/fade-up";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/data-product";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export default function SearchDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 500);
  const [isLoading, setIsLoading] = useState(false);

  const foundProducts = products.filter((product) =>
    product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [searchQuery]);

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
        {debouncedSearchQuery && !isLoading && (
          <div className="max-h-[50vh] overflow-y-auto">
            <p className="px-2 text-muted-foreground text-xs">
              {foundProducts.length} {foundProducts.length === 1 ? "product" : "products"} found
            </p>
            <FadeUpContainer className="flex flex-col px-2" delay={0.05}>
              {foundProducts.map((product) => (
                <FadeUpItem key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group relative flex items-center gap-2 rounded-md p-2 transition-colors duration-300 hover:bg-accent"
                    key={product.id}
                  >
                    <img
                      src={product.image_primary}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="aspect-square rounded-md bg-secondary object-cover"
                    />
                    <img
                      src={product.image_secondary}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="absolute inset-2 aspect-square rounded-md bg-secondary object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <p>{product.name}</p>
                  </Link>
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
  );
}
