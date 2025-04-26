import { SpecialButton } from "@/components/shared/special-button";
import { APP_NAME } from "@/lib/config/app.config";
import { SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { NavLinks } from "./nav-links";

export const HeaderNav = () => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-1 md:px-8">
      {/* Left */}
      <NavLinks />

      {/* Logo */}
      <div className="">
        <Link href="/" className="flex items-center">
          <div className="relative h-10">
            <div className="font-bold font-script text-2xl text-gray-800 transition-colors duration-300 hover:text-primary">
              {APP_NAME}
            </div>
            <div className="-bottom-1 -translate-x-1/2 absolute left-1/2 w-full">
              <svg viewBox="0 0 100 10" className="h-3 w-full text-primary">
                <path d="M0,5 C30,15 70,-5 100,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-8">
        <div className="flex items-center gap-4">
          <div className="cursor-pointer transition-colors duration-300 hover:text-primary">
            <SearchIcon />
          </div>
          <div className="cursor-pointer transition-colors duration-300 hover:text-primary">
            <UserIcon />
          </div>
          <div className="cursor-pointer transition-colors duration-300 hover:text-primary">
            <ShoppingBagIcon />
          </div>
        </div>
        <SpecialButton>Special Offers</SpecialButton>
      </div>
    </div>
  );
};
