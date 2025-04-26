import { SpecialButton } from "@/components/shared/special-button";
import { APP_NAME } from "@/lib/config/app.config";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { AuthDialog } from "./auth-dialog";
import { NavLinks } from "./nav/nav-links";
import SearchDialog from "./search-dialog";

export const HeaderNav = () => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-1 md:px-8">
      {/* Left */}
      <NavLinks />

      {/* Logo */}
      <div className="">
        <Link href="/" className="group flex items-center">
          <img
            src="/images/logo-with-text.png"
            alt={APP_NAME}
            width={50}
            height={50}
            className="transition-all duration-300 group-hover:scale-110"
          />
        </Link>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-8">
        <div className="flex items-center gap-4">
          <SearchDialog key="search-dialog" />
          <AuthDialog key="auth-dialog" />
          <Link href="/cart" prefetch={false} className="transition-colors duration-300 hover:text-primary">
            <ShoppingBagIcon className="size-4 md:size-6" />
          </Link>
        </div>
        <SpecialButton className="hidden md:flex">Special Offers</SpecialButton>
      </div>
    </div>
  );
};
