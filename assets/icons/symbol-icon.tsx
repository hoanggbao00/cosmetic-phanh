import { cn } from "@/lib/utils";
import type { IconProps } from "./type";

export const SymbolIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 40 40"
      xmlSpace="preserve"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path d="M20,2.7l4.2,20.6l15.8,14l-20-6.7L0,37.3l15.8-14L20,2.7z" fill="currentColor" />
    </svg>
  );
};
