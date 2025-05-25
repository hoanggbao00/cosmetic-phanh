import { APP_NAME } from "@/lib/config/app.config";
import { Facebook, Gift, Instagram, SmilePlus, Tag, Truck, TwitterIcon } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Tag,
    title: `Best authentic ${APP_NAME} deals`,
  },
  {
    icon: Truck,
    title: "Nationwide delivery in 2-4 days",
  },
  {
    icon: Gift,
    title: "Most attractive gifts",
  },
  {
    icon: SmilePlus,
    title: "Peace of mind with 30-day returns",
  },
];

const links = [
  {
    title: "Shop and Learn",
    links: [
      {
        title: "Shop",
        href: "/shop",
      },
      {
        title: "Contact",
        href: "/contact",
      },
      {
        title: "Hiring",
        href: "/hiring",
      },
      {
        title: "Distributors",
        href: "/distributors",
      },
    ],
  },
  {
    title: `About ${APP_NAME}`,
    links: [
      {
        title: "About Us",
        href: "/about-us",
      },
      {
        title: "Careers",
        href: "/careers",
      },
      {
        title: "Phone",
        href: "/phone",
      },
      {
        title: "Inbox",
        href: "/inbox",
      },
      {
        title: "Animal Testing Policy",
        href: "/animal-testing-policy",
      },
    ],
  },
  {
    title: "Policies",
    links: [
      {
        title: "Shipping Policy",
        href: "/shipping-policy",
      },
      {
        title: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        title: "Return Policy",
        href: "/return-policy",
      },
      {
        title: "Payment Policy",
        href: "/payment-policy",
      },
      {
        title: "Payment Guide",
        href: "/payment-guide",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className='w-full bg-white pt-10'>
      {/* Features Section */}
      <div className='grid grid-cols-1 border-b md:grid-cols-2 lg:grid-cols-4'>
        {features.map((feature) => (
          <div
            className='flex flex-col items-center justify-center border-t border-r p-8'
            key={feature.title}
          >
            <feature.icon className='mb-4 size-10 text-gray-700' />
            <p className='text-center text-sm'>{feature.title}</p>
          </div>
        ))}
      </div>

      {/* Links Section */}
      <div className='grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-4'>
        {/* Shop and Learn */}
        {links.map((link) => (
          <div key={link.title}>
            <h3 className='mb-4 font-medium text-gray-900'>{link.title}</h3>
            <ul className='space-y-2'>
              {link.links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className='text-gray-600 text-sm uppercase hover:text-primary'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Company Info */}
        <div>
          <h3 className='mb-4 font-medium text-gray-900'>CTY TNHH HAIANH Cosmetics</h3>
          <p className='mb-4 text-gray-600 text-sm'>
            Business Registration Certificate: 0317435017 - Date of issue: 17/08/2022
          </p>
          <p className='mb-4 text-gray-600 text-sm'>
            Registered by: Department of Planning and Investment of Ho Chi Minh City
          </p>
          <p className='text-gray-600 text-sm'>
            Registered address: 441/38B Dien Bien Phu, Ward 25, Binh Thanh District, Ho Chi Minh
            City, Vietnam
          </p>
        </div>
      </div>

      {/* Copyright and Social */}
      <div className='border-t p-6'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <p className='mb-4 text-gray-500 text-sm md:mb-0'>
            © {new Date().getFullYear()} - {APP_NAME}
          </p>
          <div className='flex space-x-4'>
            <Link href='#' className='text-gray-500 hover:text-gray-900'>
              <Facebook className='h-5 w-5' />
              <span className='sr-only'>Facebook</span>
            </Link>
            <Link href='#' className='text-gray-500 hover:text-gray-900'>
              <Instagram className='h-5 w-5' />
              <span className='sr-only'>Instagram</span>
            </Link>
            <Link href='#' className='text-gray-500 hover:text-gray-900'>
              <TwitterIcon className='h-5 w-5' />
              <span className='sr-only'>Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
