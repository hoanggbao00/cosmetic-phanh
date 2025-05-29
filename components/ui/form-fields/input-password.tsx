"use client"

import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { Button } from "../button"
import { Input } from "../input"

interface Props extends Omit<ComponentProps<"input">, "type" | "size"> {
  name: string
  inputClassName?: string
  size?: "sm" | "md" | "lg"
}

export const InputPassword = ({ name, className, inputClassName, ...props }: Props) => {
  const [showPassword, setShowPassword] = useState(false)

  const onTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("w-full pr-8", inputClassName)}
        {...props}
      />
      <Button
        variant="ghost"
        size="icon"
        className="-translate-y-1/2 absolute top-1/2 right-2 size-6"
        onClick={onTogglePassword}
        type="button"
      >
        {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </Button>
    </div>
  )
}
