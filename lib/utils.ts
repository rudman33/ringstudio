import { clsx, type ClassValue } from 'clsx'

// Tailwind class merging helper
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format price from cents
export function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
}

// Generate a short readable ID
export function shortId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

// Extract subdomain from hostname
export function getSubdomain(hostname: string, appDomain: string): string | null {
  const match = hostname.match(
    new RegExp(`^([a-z0-9-]+)\\.(?:${appDomain.replace('.', '\\.')}|localhost)`)
  )
  const reserved = ['www', 'admin', 'superadmin', 'api']
  const sub = match?.[1]
  return sub && !reserved.includes(sub) ? sub : null
}

// Validate hex color
export function isValidHex(color: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}
