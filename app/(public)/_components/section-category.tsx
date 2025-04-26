import { StarIcon } from "@/assets/icons/star-icon";
import { SymbolIcon } from "@/assets/icons/symbol-icon";
import { SpecialButton } from "@/components/shared/special-button";
import Link from "next/link";

export function SectionCategory() {
  const categories = [
    "Blenders",
    "Body Spray",
    "Concealer",
    "Exfoliators",
    "Eyeshadow",
    "Face Masks",
    "Facial Rollers",
    "Foundation",
    "Highlighter",
    "Sunscream",
    "Toners",
    "Body Lotion",
    "Blushes",
    "Nail Polishes",
    "Lipsticks",
    "Body Scrubs",
  ];

  return (
    <section className="w-full bg-background px-4 py-16" id="scroll-down-section">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Title */}
        <div className="flex flex-col items-center">
          <div className="mb-2 flex items-center gap-2">
            <StarIcon className="animate-spin text-primary" />
            <span className="text-gray-700 text-sm">Dermatologist-Approved</span>
          </div>
          <h2 className="font-semibold font-serif text-4xl text-primary md:text-5xl">Luxurious Products</h2>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={category}
              className="group hover:-translate-y-2 flex items-center transition-transform duration-300 hover:scale-105"
            >
              {index !== 0 && (
                <div className="hidden md:block">
                  <SymbolIcon className="size-8 origin-center text-primary transition-transform duration-300 group-hover:rotate-90" />
                </div>
              )}
              <Link
                href="#"
                className="px-2 text-foreground text-sm tracking-wide transition-all duration-300 hover:text-primary md:text-base lg:text-xl"
              >
                {category}
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/catalog">
            <SpecialButton>View All Categories</SpecialButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
