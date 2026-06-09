// app/(builder)/[subdomain]/layout.tsx
// Loads account branding server-side and injects CSS variables
// so the builder matches the jeweler's brand colours.

import { notFound } from 'next/navigation'
import { createServiceClient } from '../lib/supabase-server'

interface Props {
  children: React.ReactNode
  params: { subdomain: string }
}

export default async function BuilderLayout({ children, params }: Props) {
  const { subdomain } = params
  const supabase = createServiceClient()

  const { data: account } = await supabase
    .from('accounts')
    .select('id, business_name, logo_url, brand_color, status')
    .or(`subdomain.eq.${subdomain},custom_domain.eq.${subdomain}`)
    .single()

  if (!account || account.status === 'suspended' || account.status === 'cancelled') {
    notFound()
  }

  // Inject brand colour as CSS variable for the entire builder
  const brandColor = account.brand_color || '#B5966D'

  return (
    <>
      <style>{`
        :root {
          --brand: ${brandColor};
          --brand-dark: color-mix(in srgb, ${brandColor} 80%, black);
          --brand-pale: color-mix(in srgb, ${brandColor} 12%, white);
        }
      `}</style>
      {children}
    </>
  )
}
