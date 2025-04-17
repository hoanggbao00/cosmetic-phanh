"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export const NavItem = ({ href, children, isActive = false }: NavItemProps) => {
  return (
    <Link href={href} className="group relative font-medium">
      <span
        className={cn(
          "-translate-y-1/2 absolute top-1/2 text-primary",
          "left-4 group-hover:left-0",
          "opacity-0 group-hover:opacity-100",
          "transition-all duration-300",
          isActive && "left-0 opacity-100",
        )}
      >
        ✦
      </span>
      <p
        className={cn(
          "pl-4 transition-colors duration-300 group-hover:text-primary",
          isActive && "text-primary",
          "delay-100",
        )}
      >
        {children}
      </p>
    </Link>
  );
};
