import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '../../../../../lib/stripe'

const ACCOUNT_ID = '8433f769-632e-4426-b07b-0f5c9e7a2fe6'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const supabase = getClient()
  const { data: account, error } = await supabase
    .from('accounts')
    .select('stripe_customer_id')
    .eq('id', ACCOUNT_ID)
    .single()

  if (error || !account?.stripe_customer_id) {
    return NextResponse.json({ error: 'No active subscription yet' }, { status: 400 })
  }

  const origin = req.nextUrl.origin

  const session = await stripe.billingPortal.sessions.create({
    customer: account.stripe_customer_id,
    return_url: `${origin}/admin/dashboard`,
  })

  return NextResponse.json({ data: { url: session.url } })
}
