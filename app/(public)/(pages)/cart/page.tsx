import PageLayout from "@/components/layout/(public)/page-layout"
import CartView from "./_components/cart-view"

export default async function CartPage() {
  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 md:px-0">
      <CartView />
    </PageLayout>
  )
}
