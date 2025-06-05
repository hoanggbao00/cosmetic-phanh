"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/utils/supabase/client"
import { LogOutIcon, ShoppingBag, UserIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserInfo {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export function UserDropdown() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (profile) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          })
        }
      }
      setIsLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null)
      } else if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          })
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (isLoading) {
    return <div className="size-4 animate-pulse rounded-full bg-muted md:size-6" />
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="cursor-pointer transition-colors duration-300 hover:text-primary"
      >
        <UserIcon className="size-4 md:size-6" />
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <UserIcon className="!size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{user.full_name || "User"}</p>
            <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              <ShoppingBag className="mr-2 size-4" />
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
          onClick={handleSignOut}
        >
          <LogOutIcon className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
