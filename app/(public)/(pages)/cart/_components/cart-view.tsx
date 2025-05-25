"use client";

import { useCartStore } from "@/stores/cart-store";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";
import EmptyCart from "./empty-cart";

export default function CartView() {
  const { items, itemCount, totalPrice } = useCartStore();

  // Hydrate the store on client side
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 flex items-center gap-2 font-bold text-2xl md:text-3xl'>
        <ShoppingBag className='h-6 w-6' />
        Your Shopping Cart ({itemCount()} {itemCount() === 1 ? "item" : "items"})
      </h1>

      <div className='flex flex-col gap-8 lg:flex-row'>
        {/* Cart Items */}
        <div className='lg:w-2/3'>
          <div className='rounded-lg border bg-white shadow-sm'>
            <div className='p-6'>
              <div className='hidden grid-cols-12 gap-4 border-b pb-4 font-medium text-muted-foreground text-sm md:grid'>
                <div className='col-span-6'>Product</div>
                <div className='col-span-2 text-center'>Price</div>
                <div className='col-span-2 text-center'>Quantity</div>
                <div className='col-span-2 text-right'>Total</div>
              </div>

              <div className='divide-y'>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          <div className='mt-6'>
            <Link
              href='/catalog'
              className='inline-flex items-center font-medium text-primary text-sm hover:underline'
            >
              <ArrowLeft className='mr-1 h-4 w-4' />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className='lg:w-1/3'>
          <CartSummary subtotal={totalPrice()} />
        </div>
      </div>
    </div>
  );
}
