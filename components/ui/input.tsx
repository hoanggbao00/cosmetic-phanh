import * as React from "react";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className='relative w-full'>
        {StartIcon && (
          <div className='-translate-y-1/2 absolute top-1/2 left-1.5 transform'>
            <StartIcon size={18} className='text-muted-foreground' />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-8" : "",
            endIcon ? "pr-8" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className='-translate-y-1/2 absolute top-1/2 right-3 transform'>
            <EndIcon className='text-muted-foreground' size={18} />
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
