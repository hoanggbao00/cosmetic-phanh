import { updateSession } from "@/utils/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match request path start with:
     * - /admin
     * - /profile
     */
    "/admin/:path*",
    "/profile/:path*",
  ],
}
