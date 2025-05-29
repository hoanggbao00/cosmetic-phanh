import type { SVGIcon } from "@/assets/icons/type"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { Control, ControllerRenderProps, FieldValues, Path } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"

interface FieldWrapperProps<T extends FieldValues, P extends Path<T>> {
  control: Control<T>
  name: P
  label?: string
  description?: string
  parentClassName?: string
  startIcon?: LucideIcon | SVGIcon
  endIcon?: LucideIcon | SVGIcon
  size?: "sm" | "md" | "lg"
  required?: boolean
  children: React.ReactNode | ((field: ControllerRenderProps<T, P>) => React.ReactNode)
}

export const FieldWrapper = <T extends FieldValues, P extends Path<T>>({
  control,
  name,
  label,
  description,
  parentClassName,
  required,
  children,
}: FieldWrapperProps<T, P>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full space-y-1", parentClassName)}>
          {label && (
            <FormLabel className="mb-0 gap-1">
              {label} {required && <span className="text-error-foreground">*</span>}
            </FormLabel>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>{typeof children === "function" ? children(field) : children}</FormControl>
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  )
}
