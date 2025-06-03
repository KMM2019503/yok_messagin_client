import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/content/chats", "/content/friends"]

const protectedRoutePrefixes = ["/content/chats/"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const pathname = request.nextUrl.pathname

  // Check if the current path is protected
  const isProtectedRoute =
    protectedRoutes.includes(pathname) || protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix))

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/content/chats/:path*", "/content/friends/:path*", "/content/chats", "/content/friends"],
}
