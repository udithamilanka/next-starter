import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicRoute = publicRoutes.includes(pathname)
  const accessToken = request.cookies.get('access_token')?.value

  // Redirect unauthenticated users away from protected routes
  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from the login page
  if (isPublicRoute && accessToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
