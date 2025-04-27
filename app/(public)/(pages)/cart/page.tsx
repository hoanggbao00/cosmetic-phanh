import PageLayout from "@/components/layout/(public)/page-layout";
import { delay } from "@/lib/utils";
import CartView from "./_components/cart-view";

export default async function CartPage() {
  await delay(1000);

  return (
    <PageLayout className="mx-auto min-h-screen w-full max-w-7xl px-4 md:px-0">
      <CartView />
    </PageLayout>
  );
}
