"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/utils/supabase/client"
import { LogOut } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

interface UserDropdownProps {
  user: {
    full_name: string
    email: string
  }
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter()

  const onLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/", { scroll: false })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={""} />
          <AvatarFallback>{user.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex-col items-start gap-0">
          <p className="font-medium text-sm">{user.full_name}</p>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
