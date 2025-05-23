import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/content/chats', '/content/friends']
 
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/content/:path*'],
}