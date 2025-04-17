import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface SpecialButtonProps extends React.ComponentProps<"button"> {
  children: string;
  className?: string;
}

export const SpecialButton = ({ children, className, ...props }: SpecialButtonProps) => {
  return (
    <Button
      className={cn("group select-none rounded-full bg-primary px-4 py-2 text-white tracking-wide", className)}
      effect="shine"
      {...props}
    >
      <span className="icon transition-transform duration-500 group-hover:rotate-45">✦</span>
      {children}
      <span className="icon transition-transform duration-500 group-hover:rotate-45">✦</span>
    </Button>
  );
};
