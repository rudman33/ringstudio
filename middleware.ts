import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'ringstudio.com'

  const subdomainMatch = hostname.match(
    new RegExp(`^([a-z0-9-]+)\\.(?:${appDomain.replace('.', '\\.')}|localhost)`)
  )
  const subdomain = subdomainMatch?.[1]
  const reservedSubdomains = ['www', 'admin', 'superadmin', 'api']

  if (subdomain && !reservedSubdomains.includes(subdomain)) {
    url.pathname = `/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)'],
}
