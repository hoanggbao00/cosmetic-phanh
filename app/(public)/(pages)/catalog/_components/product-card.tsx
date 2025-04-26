import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product.types";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card key={product.id} className="group cursor-pointer rounded-none bg-transparent p-4 shadow-none md:p-8">
      <CardContent className="flex flex-col items-center p-0">
        <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-secondary transition-all duration-300 group-hover:rounded-full">
          <img
            src={product.image_primary}
            alt={product.name}
            className="size-full object-contain transition-all duration-300 group-hover:scale-110"
          />
          <Link href={`/product/${product.id}`} className="absolute inset-0">
            <img
              src={product.image_secondary}
              alt={product.name}
              className="size-full scale-110 object-contain opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          </Link>
          {/* Button */}
          <div className="-translate-x-1/2 absolute bottom-0 left-1/2 min-w-[120px] opacity-0 transition-all duration-500 group-hover:bottom-[10%] group-hover:opacity-100">
            <Link
              href={`/product/${product.id}`}
              className="group/link relative rounded-full bg-primary px-2.5 py-1.5 text-white transition-colors duration-300 hover:bg-primary/70"
            >
              <span className="group-hover/link:-translate-y-1/2 group-hover/link:opacity-0">View Product</span>
              <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 opacity-0 transition-all duration-300 group-hover/link:opacity-100">
                <ShoppingBagIcon size={20} />
              </span>
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-muted-foreground text-sm">
            {product.category.map((category, index) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="transition-colors duration-300 hover:text-primary"
              >
                {category}
                {product.category[index + 1] && ", "}
              </Link>
            ))}
          </div>
          <Link href={`/product/${product.id}`} className="transition-colors duration-300 hover:text-primary">
            <h3 className="font-medium text-2xl">{product.name}</h3>
          </Link>
          <p className="mt-1 text-sm">Starts From ${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
