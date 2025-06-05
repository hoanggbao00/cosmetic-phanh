"use client"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCartStore } from "@/stores/cart-store"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import ProductGallery from "./product-gallery"
import ProductInfo from "./product-info"
import RelatedPosts from "./related-posts"
import RelatedProducts from "./related-products"

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  // Fetch product data (simulated)
  const product = {
    id: productId,
    name: "Luminous Radiance Serum",
    price: 48.99,
    rating: 4.8,
    reviewCount: 124,
    sizes: [
      { id: 1, name: "30ml", price: 48.99 },
      { id: 2, name: "50ml", price: 68.99 },
      { id: 3, name: "100ml", price: 98.99 },
    ],
    images: [
      "/images/products/product_1_primary.png",
      "/images/products/product_1_secondary.png",
      "/images/products/product_1_primary.png",
      "/images/products/product_1_secondary.png",
    ],
    description: `
      <div class="prose prose-sm md:prose-base lg:prose-lg max-w-none">
        <p>Discover the transformative power of our <strong>Luminous Radiance Serum</strong>, a revolutionary formula designed to revitalize your skin and restore its natural glow. This lightweight, fast-absorbing serum is packed with potent ingredients that work synergistically to address multiple skin concerns simultaneously.</p>
        
        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Brightens & Evens Skin Tone:</strong> Vitamin C and niacinamide work together to fade dark spots and hyperpigmentation, revealing a more even complexion.</li>
          <li><strong>Hydrates & Plumps:</strong> Hyaluronic acid draws moisture into the skin, instantly plumping fine lines and wrinkles.</li>
          <li><strong>Protects & Repairs:</strong> Antioxidant-rich ingredients neutralize free radicals and strengthen the skin's natural barrier.</li>
          <li><strong>Soothes & Calms:</strong> Centella asiatica extract reduces redness and inflammation, making it suitable for sensitive skin.</li>
        </ul>
        
        <h3>Key Ingredients</h3>
        <p><strong>Stabilized Vitamin C (10%):</strong> A powerful antioxidant that brightens skin, boosts collagen production, and protects against environmental damage.</p>
        <p><strong>Niacinamide (5%):</strong> Improves skin texture, minimizes pores, and strengthens the skin barrier while reducing inflammation.</p>
        <p><strong>Hyaluronic Acid Complex:</strong> A blend of low, medium, and high molecular weight hyaluronic acid that hydrates at multiple skin layers.</p>
        <p><strong>Peptide Complex:</strong> Signals the skin to produce more collagen, resulting in firmer, more resilient skin over time.</p>
        <p><strong>Centella Asiatica Extract:</strong> Calms irritation and supports skin healing with its anti-inflammatory properties.</p>
        
        <h3>How to Use</h3>
        <ol>
          <li>Apply to clean, dry skin in the morning and evening.</li>
          <li>Dispense 3-4 drops onto fingertips.</li>
          <li>Gently pat and press into face and neck.</li>
          <li>Allow to absorb for 30 seconds before applying moisturizer.</li>
          <li>For daytime use, always follow with SPF protection.</li>
        </ol>
        
        <h3>Perfect For</h3>
        <p>All skin types, including sensitive skin. Especially beneficial for those concerned with dullness, uneven texture, fine lines, and dehydration.</p>
        
        <div class="bg-amber-50 p-4 rounded-md border border-amber-200 my-6">
          <p class="text-amber-800 font-medium">Clinical Results</p>
          <ul class="text-amber-700 mt-2">
            <li>92% of users reported brighter, more radiant skin after 2 weeks</li>
            <li>87% noticed improved skin texture and smoothness</li>
            <li>94% experienced increased hydration and plumpness</li>
          </ul>
        </div>
        
        <h3>Formulated Without</h3>
        <p>Parabens, sulfates, phthalates, mineral oil, synthetic fragrances, or artificial colors. Vegan and cruelty-free.</p>
      </div>
    `,
    features: [
      "Dermatologist tested",
      "Non-comedogenic",
      "Fragrance-free",
      "Suitable for sensitive skin",
      "Vegan & cruelty-free",
    ],
    ingredients:
      "Aqua/Water/Eau, Ascorbic Acid, Glycerin, Niacinamide, Propanediol, Butylene Glycol, Sodium Hyaluronate, Acetyl Hexapeptide-8, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Centella Asiatica Extract, Panthenol, Tocopherol, Adenosine, Sodium Citrate, Citric Acid, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin.",
  }

  // Handle size selection
  useEffect(() => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0].name)
    }
  }, [product.sizes, selectedSize])

  // Get current price based on selected size
  const getCurrentPrice = () => {
    if (!selectedSize) return product.price
    const size = product.sizes.find((s) => s.name === selectedSize)
    return size ? size.price : product.price
  }

  // Handle add to cart
  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: product.name,
      price: getCurrentPrice(),
      image: product.images[0],
      quantity: quantity,
      size: selectedSize || undefined,
    })
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Product Detail Section */}
        <div className="mb-16 flex flex-col gap-8 lg:flex-row">
          {/* Product Gallery */}
          <div className="lg:w-1/2">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              currentPrice={getCurrentPrice()}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-16">
          <Collapsible className="rounded-lg border border-accent">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                icon={ChevronDown}
                iconPlacement="right"
                className="w-full justify-between"
              >
                <h2 className="font-bold text-2xl">Product Details</h2>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Related Products */}
        <div className="mb-16">
          <h2 className="mb-6 font-bold text-2xl">You May Also Like</h2>
          <RelatedProducts currentProductId={productId} />
        </div>

        {/* Related Posts */}
        <div className="mb-16">
          <h2 className="mb-6 font-bold text-2xl">Related Articles</h2>
          <RelatedPosts productCategory="Skincare" />
        </div>
      </div>
    </div>
  )
}
