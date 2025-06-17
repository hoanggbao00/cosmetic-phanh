"use client"

import { useStoreConfigQuery } from "@/queries/store-config"
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react"

const socialLinks = [
  {
    href: "/#facebook",
    icon: FacebookIcon,
  },
  {
    href: "/#instagram",
    icon: InstagramIcon,
  },
  {
    href: "/#twitter",
    icon: TwitterIcon,
  },
]

export const TopBar = () => {
  const { data: storeConfig } = useStoreConfigQuery()

  return (
    <div className="border-b px-4 py-2.5 md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex w-fit items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-300 hover:text-primary"
              target="_blank"
              rel="noreferrer"
            >
              <link.icon size={20} />
            </a>
          ))}
        </div>
        <p className="hidden max-w-2/3 text-center font-semibold font-serif md:block">
          {storeConfig?.notification}
        </p>
      </div>
    </div>
  )
}
