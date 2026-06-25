import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../../lib/stripe'
import { getAccountId } from '../../../../../lib/get-account'

export async function POST(req: NextRequest) {
  const result = await getAccountId()
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const priceId = process.env.STRIPE_PRICE_DESIGN_PACK
  if (!priceId) {
    return NextResponse.json({ error: 'Design pack pricing is not configured' }, { status: 500 })
  }

  const origin = req.nextUrl.origin

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/admin/dashboard?designs=purchased`,
    cancel_url: `${origin}/admin/dashboard?designs=cancelled`,
    metadata: { account_id: result.accountId, type: 'design_pack' },
  })

  return NextResponse.json({ data: { url: session.url } })
}
