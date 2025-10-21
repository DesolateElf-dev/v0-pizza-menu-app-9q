import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'pizzaria-session'

const protectedPaths = [
  '/checkout',
  '/perfil',
  '/pedidos',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const c = cookies().get(SESSION_COOKIE_NAME)
  if (!c?.value) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*', '/perfil/:path*', '/pedidos/:path*'],
}
