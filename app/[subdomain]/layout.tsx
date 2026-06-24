import { notFound } from 'next/navigation'
import { createServiceClient } from '../../lib/supabase-server'

interface Props {
  children: React.ReactNode
  params: Promise<{ subdomain: string }>
}

export default async function BuilderLayout({ children, params }: Props) {
  const { subdomain } = await params
  const supabase = createServiceClient()

  const { data: account } = await supabase
    .from('accounts')
    .select('id, business_name, logo_url, brand_color, status')
    .or(`subdomain.eq.${subdomain},custom_domain.eq.${subdomain}`)
    .single()

  if (!account || account.status === 'suspended' || account.status === 'cancelled') {
    notFound()
  }

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
