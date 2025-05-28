import type { SVGIcon } from "@/assets/icons/type";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Input } from "../input";
import { InputPassword } from "./input-password";

interface InputFieldProps<T extends FieldValues> extends Omit<ComponentProps<"input">, "size"> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  parentClassName?: string;
  startIcon?: LucideIcon | SVGIcon;
  endIcon?: LucideIcon | SVGIcon;
  size?: "sm" | "md" | "lg";
  required?: boolean;
}

export const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  description,
  parentClassName,
  size,
  required,
  ...props
}: InputFieldProps<T>) => {
  const Comp = type === "password" ? InputPassword : Input;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1", parentClassName)}>
          {label && (
            <FormLabel className='gap-1'>
              {label} {required && <span className='text-error-foreground'>*</span>}
            </FormLabel>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <Comp {...field} {...props} size={size} />
          </FormControl>
          <FormMessage className='mt-1' />
        </FormItem>
      )}
    />
  );
};
