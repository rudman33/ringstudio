import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // ── Superadmin gate ────────────────────────────────────────────────────────
  // Block the /superadmin pages server-side for anyone not signed in, so the
  // page shell never renders for a stranger. The API routes remain the real
  // authority: they check the super_admins table.
  if (url.pathname.startsWith('/superadmin')) {
    const res = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }
    return res
  }

  // ── Subdomain routing (unchanged) ──────────────────────────────────────────
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
