import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="mb-2 font-bold text-2xl">Your cart is empty</h1>

        <p className="mb-8 text-muted-foreground">
          Looks like you haven't added any products to your cart yet.
        </p>

        <Button asChild size="lg">
          <Link href="/catalog" className="flex items-center">
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <div className="mt-2 flex items-center justify-center">
          <Link
            href="/orders/local"
            className="flex items-center text-primary underline hover:text-primary/80"
          >
            Order History
          </Link>
        </div>
      </div>
    </div>
  )
}
