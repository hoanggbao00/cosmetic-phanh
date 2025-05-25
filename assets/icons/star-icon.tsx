import { cn } from "@/lib/utils";
import type { IconProps } from "./type";

export const StarIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      x='0px'
      y='0px'
      viewBox='0 0 20 20'
      xmlSpace='preserve'
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path
        d='M10,0l2.7,7.3L20,10l-7.3,2.7L10,20l-2.7-7.3L0,10l7.3-2.7L10,0z'
        fill='currentColor'
      />
    </svg>
  );
};
