import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { stripe, PLAN_BY_PRICE_ID } from '../../../../lib/stripe'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const accountId = session.metadata?.account_id || session.client_reference_id

        if (accountId && session.subscription && session.customer) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = priceId ? PLAN_BY_PRICE_ID[priceId] : undefined

          await supabase
            .from('accounts')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              plan: plan || 'starter',
              status: subscription.status === 'trialing' ? 'trial' : 'active',
              trial_ends_at: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
            })
            .eq('id', accountId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const accountId = subscription.metadata?.account_id
        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId ? PLAN_BY_PRICE_ID[priceId] : undefined

        const status =
          subscription.status === 'trialing' ? 'trial' :
          subscription.status === 'active' ? 'active' :
          subscription.status === 'canceled' ? 'cancelled' :
          subscription.status === 'past_due' ? 'active' :
          'suspended'

        const updatePayload: Record<string, unknown> = {
          stripe_subscription_id: subscription.id,
          status,
          trial_ends_at: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
        }
        if (plan) updatePayload.plan = plan

        if (accountId) {
          await supabase.from('accounts').update(updatePayload).eq('id', accountId)
        } else {
          await supabase
            .from('accounts')
            .update(updatePayload)
            .eq('stripe_customer_id', subscription.customer as string)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await supabase
          .from('accounts')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
