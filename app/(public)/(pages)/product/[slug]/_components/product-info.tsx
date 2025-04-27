"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Minus, Plus, RotateCcw, Share2, ShieldCheck, Truck } from "lucide-react";

interface ProductInfoProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  product: any;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  currentPrice: number;
  onAddToCart: () => void;
}

export default function ProductInfo({
  product,
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  currentPrice,
  onAddToCart,
}: ProductInfoProps) {
  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(Math.max(1, quantity - 1));

  return (
    <div className="flex h-full flex-col">
      {/* Product Title and Rating */}
      <div className="mb-4">
        <h1 className="mb-2 font-bold text-2xl text-gray-900 md:text-3xl">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="font-bold text-2xl text-gray-900">${currentPrice.toFixed(2)}</span>
      </div>

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 font-medium text-gray-900 text-sm">Size</h3>
          <RadioGroup value={selectedSize || ""} onValueChange={setSelectedSize} className="flex gap-3">
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {product.sizes.map((size: any) => (
              <div key={size.id} className="flex items-center space-x-2">
                <RadioGroupItem value={size.name} id={`size-${size.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`size-${size.id}`}
                  className="flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white font-medium text-gray-900 text-sm hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                >
                  {size.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <h3 className="mb-3 font-medium text-gray-900 text-sm">Quantity</h3>
        <div className="flex w-32 items-center rounded-md border border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>

          <span className="flex-1 text-center font-medium text-sm">{quantity}</span>

          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={incrementQuantity}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Add to Cart and Wishlist */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Button className="flex-1" size="lg" onClick={onAddToCart}>
          Add to Cart
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12">
          <Heart className="h-5 w-5" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share product</span>
        </Button>
      </div>

      {/* Product Features */}
      <div className="mb-8">
        <h3 className="mb-3 font-medium text-gray-900 text-sm">Highlights</h3>
        <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {product.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping and Returns */}
      <div className="space-y-4 border-gray-200 border-t pt-6 text-sm">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Free shipping</p>
            <p className="text-gray-500">On orders over $50. Delivery in 3-5 business days.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Easy returns</p>
            <p className="text-gray-500">30-day return policy. No questions asked.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Satisfaction guaranteed</p>
            <p className="text-gray-500">Love it or get a full refund.</p>
          </div>
        </div>
      </div>

      {/* Ingredients Tab */}
      <div className="mt-auto pt-6">
        <Tabs defaultValue="ingredients">
          <TabsList className="w-full">
            <TabsTrigger value="ingredients" className="flex-1">
              Ingredients
            </TabsTrigger>
            <TabsTrigger value="how-to-use" className="flex-1">
              How to Use
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="mt-4 text-gray-600 text-sm">
            <p className="leading-relaxed">{product.ingredients}</p>
          </TabsContent>
          <TabsContent value="how-to-use" className="mt-4 text-gray-600 text-sm">
            <ol className="list-decimal space-y-2 pl-4">
              <li>Apply to clean, dry skin in the morning and evening.</li>
              <li>Dispense 3-4 drops onto fingertips.</li>
              <li>Gently pat and press into face and neck.</li>
              <li>Allow to absorb for 30 seconds before applying moisturizer.</li>
              <li>For daytime use, always follow with SPF protection.</li>
            </ol>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
