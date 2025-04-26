"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/config/app.config";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavItem } from "./nav-item";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/blog", label: "Blog" },
  { href: "/blog/about", label: "About" },
  { href: "/blog/contact", label: "Contact" },
];

export const NavLinks = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) {
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
  }

  return (
    <div className="order-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{APP_NAME}</SheetTitle>
            <SheetDescription hidden>{APP_DESCRIPTION}</SheetDescription>
            <div className="p-4">
              <ul>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <NavItem href={item.href} isActive={pathname === item.href} className="text-2xl tracking-wide">
                      {item.label}
                    </NavItem>
                  </li>
                ))}
              </ul>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
