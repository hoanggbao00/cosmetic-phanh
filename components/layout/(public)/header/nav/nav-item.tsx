"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface NavItemProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  className?: string
}

export const NavItem = ({ href, children, isActive = false, className }: NavItemProps) => {
  return (
    <Link href={href} className={cn("group relative font-medium", className)}>
      <span
        className={cn(
          "-translate-y-1/2 absolute top-1/2 text-primary",
          "group-hover:-left-1 left-4",
          "opacity-0 group-hover:opacity-100",
          "transition-all duration-300",
          isActive && "-left-1 opacity-100"
        )}
      >
        ✦
      </span>
      <p
        className={cn(
          "pl-4 transition-colors duration-300 group-hover:text-primary",
          isActive && "text-primary",
          "delay-100"
        )}
      >
        {children}
      </p>
    </Link>
  )
}
