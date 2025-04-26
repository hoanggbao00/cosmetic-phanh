import { SpecialButton } from "@/components/shared/special-button";
import { ChevronDownIcon } from "lucide-react";
import { CarouselHome } from "./carousel-home";

export const SectionHome = () => {
  return (
    <section id="home" className="relative h-screen bg-accent px-4 pt-28 md:px-8">
      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4">
        <p className="text-center font-bold font-serif text-8xl capitalize leading-32">
          <u>Experience</u> the art
          <span className="inline-block px-3">
            <img
              src="https://wdtmakehub.wpengine.com/wp-content/uploads/2025/01/Text-with-img-2.jpg"
              alt="Art"
              className="h-18 w-auto rounded-full"
            />
          </span>
          Of beauty with Our <u>Premium</u> assortment
          <span className="inline-block px-3">
            <img
              src="https://wdtmakehub.wpengine.com/wp-content/uploads/2025/01/Text-with-img-1.jpg"
              alt="Collection"
              className="h-18 w-auto rounded-full"
            />
          </span>
          of <u>Cosmetics</u> wonders.
        </p>
        <SpecialButton className="mt-10 animate-bounce">Shop Now</SpecialButton>
        {/* Scroll down */}

        <a href="#scroll-down-section" className="relative mt-20 text-primary">
          <div className="-translate-x-1/2 -top-[60%] absolute left-1/2">
            <div className="h-10 w-0.5 animate-scroll-down bg-primary" />
          </div>
          <ChevronDownIcon size={32} />
        </a>
      </div>

      {/* Decorative elements */}
      <div className="-translate-y-1/2 absolute top-1/2 right-8 select-none overflow-hidden rounded-full">
        <img
          src="https://wdtmakehub.wpengine.com/wp-content/uploads/2025/01/Model-with-product.jpg"
          alt="Model with product"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute bottom-1/4 left-8">
        <CarouselHome />
      </div>
    </section>
  );
};
