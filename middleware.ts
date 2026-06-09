import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// ── Middleware: subdomain routing + auth session refresh ──
//
// How subdomain routing works:
//   tiffany.ringstudio.com  →  /app/(builder)/tiffany/page.tsx
//   ringstudio.com/admin    →  /app/(admin)/admin/...
//   ringstudio.com/superadmin → /app/(superadmin)/superadmin/...
//
// On Vercel, add *.ringstudio.com as a wildcard domain.
// Locally, test with: tiffany.localhost:3000

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'ringstudio.com'

  // ── 1. Subdomain detection ──────────────────────────────
  // Matches: tiffany.ringstudio.com  or  tiffany.localhost
  const subdomainMatch = hostname.match(
    new RegExp(`^([a-z0-9-]+)\\.(?:${appDomain.replace('.', '\\.')}|localhost)`)
  )
  const subdomain = subdomainMatch?.[1]

  // Ignore 'www' and 'admin' as subdomains — those are root routes
  const reservedSubdomains = ['www', 'admin', 'superadmin', 'api']

  if (subdomain && !reservedSubdomains.includes(subdomain)) {
    // Rewrite tiffany.ringstudio.com → /tiffany internally
    url.pathname = `/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // ── 2. Auth session refresh (Supabase SSR requirement) ──
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ── 3. Protect /admin routes ────────────────────────────
  if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/auth')) {
    if (!user) {
      url.pathname = '/auth/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // ── 4. Protect /superadmin routes ──────────────────────
  if (url.pathname.startsWith('/superadmin')) {
    if (!user) {
      url.pathname = '/auth/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    // Super admin check happens in the layout via server component
    // (can't do DB queries in middleware efficiently)
  }

  return response
}

export const config = {
  matcher: [
    // Run on all routes except static files and Supabase auth callback
    '/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)',
  ],
}
