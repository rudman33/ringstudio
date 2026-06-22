import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, PRICE_IDS, BillablePlan } from '../../../../../lib/stripe'
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

  const { plan } = (await req.json()) as { plan: BillablePlan }
  const priceId = PRICE_IDS[plan]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const supabase = getClient()
  const { data: account, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', result.accountId)
    .single()

  if (error || !account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  const origin = req.nextUrl.origin

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: account.stripe_customer_id || undefined,
    customer_email: account.stripe_customer_id ? undefined : account.email,
    client_reference_id: account.id,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { account_id: account.id, plan },
    },
    payment_method_collection: 'always',
    success_url: `${origin}/admin/dashboard?billing=success`,
    cancel_url: `${origin}/admin/dashboard?billing=cancelled`,
    metadata: { account_id: account.id, plan },
  })

  return NextResponse.json({ data: { url: session.url } })
}
