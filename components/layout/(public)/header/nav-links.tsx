"use client";

import { usePathname } from "next/navigation";
import { NavItem } from "./nav-item";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav className="flex-1">
      <ul className="flex items-center gap-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <NavItem href={item.href} isActive={pathname === item.href}>
              {item.label}
            </NavItem>
          </li>
        ))}
      </ul>
    </nav>
  );
};
