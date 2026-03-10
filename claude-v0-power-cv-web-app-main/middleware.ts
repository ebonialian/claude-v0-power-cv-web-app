import { NextRequest, NextResponse } from "next/server"
import { getMiddlewareSupabaseClient } from "@/lib/supabase/middleware"

const PROTECTED_PREFIX = "/app"
const AUTH_PATH = "/login"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = getMiddlewareSupabaseClient(req, res)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  const isAuthRoute = pathname === AUTH_PATH
  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX)

  if (!session && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = AUTH_PATH
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (session && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = PROTECTED_PREFIX
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/app/:path*", "/login"],
}

