import { APP_NAME } from "@/lib/config/app.config"
import Link from "next/link"
import { CartCount } from "./cart-count"
import { NavLinks } from "./nav/nav-links"
import SearchDialog from "./search-dialog"
import { UserDropdown } from "./user-dropdown"

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
          <UserDropdown />
          <CartCount />
        </div>
      </div>
    </div>
  )
}
