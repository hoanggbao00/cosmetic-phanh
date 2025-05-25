"use client";

import { Button } from "@/components/ui/button";
import { type CartItem as CartItemType, useCartStore } from "@/stores/cart-store";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className='flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-6'>
      {/* Product Image and Info */}
      <div className='flex items-start gap-4 md:w-1/2'>
        <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100'>
          <Image
            src={item.image || "/placeholder.svg?height=80&width=80"}
            alt={item.name}
            fill
            className='object-cover'
          />
        </div>

        <div className='min-w-0 flex-1'>
          <h3 className='truncate font-medium text-base text-gray-900'>{item.name}</h3>

          {(item.color || item.size) && (
            <div className='mt-1 text-muted-foreground text-sm'>
              {item.color && <span className='mr-2'>Color: {item.color}</span>}
              {item.size && <span>Size: {item.size}</span>}
            </div>
          )}

          <button
            type='button'
            onClick={() => removeItem(item.id)}
            className='flex cursor-pointer items-center gap-1 text-red-300 text-xs hover:text-red-400'
          >
            <X size={12} />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Price - Mobile */}
      <div className='flex items-center justify-between md:hidden'>
        <span className='font-medium text-sm'>Price:</span>
        <span className='text-sm'>${item.price.toFixed(2)}</span>
      </div>

      {/* Price - Desktop */}
      <div className='hidden text-center md:block md:w-1/6'>
        <span className='text-sm'>${item.price.toFixed(2)}</span>
      </div>

      {/* Quantity Controls */}
      <div className='flex items-center justify-between md:w-1/6 md:justify-center'>
        <span className='font-medium text-sm md:hidden'>Quantity:</span>
        <div className='flex items-center rounded-md border'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 rounded-none'
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className='h-3 w-3' />
            <span className='sr-only'>Decrease quantity</span>
          </Button>

          <span className='w-8 text-center text-sm'>{item.quantity}</span>

          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 rounded-none'
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus className='h-3 w-3' />
            <span className='sr-only'>Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Total - Mobile */}
      <div className='flex items-center justify-between md:hidden'>
        <span className='font-medium text-sm'>Total:</span>
        <span className='font-medium text-sm'>${(item.price * item.quantity).toFixed(2)}</span>
      </div>

      {/* Total - Desktop */}
      <div className='hidden text-right md:block md:w-1/6'>
        <span className='font-medium text-sm'>${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  );
}
