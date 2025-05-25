import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
import { LanguageSelect } from "./language-select";

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
];

export const TopBar = () => {
  return (
    <div className='border-b px-4 py-2.5 md:px-8'>
      <div className='flex items-center justify-between'>
        <div className='flex w-fit items-center gap-2'>
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='transition-colors duration-300 hover:text-primary'
              target='_blank'
              rel='noreferrer'
            >
              <link.icon size={20} />
            </a>
          ))}
        </div>
        <p className='hidden max-w-2/3 text-center font-semibold font-serif md:block'>
          🔥 Save upto 60% OFF to all Cosmetic Products | Free Shipping on Orders Over $75
        </p>
        <LanguageSelect />
      </div>
    </div>
  );
};
