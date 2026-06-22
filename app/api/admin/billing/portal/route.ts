import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '../../../../../lib/stripe'
import { getAccountId } from '../../../../../lib/get-account'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const result = await getAccountId()
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const supabase = getClient()
  const { data: account, error } = await supabase
    .from('accounts')
    .select('stripe_customer_id')
    .eq('id', result.accountId)
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
