import type { SVGIcon } from "@/assets/icons/type"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ComponentProps } from "react"

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  startIcon?: LucideIcon | SVGIcon
  endIcon?: LucideIcon | SVGIcon
  size?: "sm" | "md" | "lg"
}

const Input = ({ className, type, startIcon, endIcon, ref, size = "md", ...props }: InputProps) => {
  const StartIcon = startIcon
  const EndIcon = endIcon

  const iconSize = size === "sm" ? 16 : size === "md" ? 18 : 20

  return (
    <div className="relative w-full">
      {StartIcon && (
        <div className="-translate-y-1/2 absolute top-1/2 left-2 transform">
          <StartIcon size={iconSize} className="text-muted-foreground" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-divider bg-field px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-input focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-muted",
          size === "sm" && "h-8 px-2",
          size === "md" && "h-10 px-4",
          size === "lg" && "h-12 px-6",
          startIcon ? "pl-8" : "",
          endIcon ? "pr-8" : "",
          className
        )}
        ref={ref}
        {...props}
      />
      {EndIcon && (
        <div className="-translate-y-1/2 absolute top-1/2 right-3 transform">
          <EndIcon className="text-muted-foreground" size={iconSize} />
        </div>
      )}
    </div>
  )
}

Input.displayName = "Input"

export { Input }
