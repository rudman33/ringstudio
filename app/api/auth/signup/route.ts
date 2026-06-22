import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { stripe, PRICE_IDS, BillablePlan } from '../../../../lib/stripe'

const RESERVED = ['www', 'admin', 'superadmin', 'api', 'auth']

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const DEFAULT_OPTIONS: Record<string, string[]> = {
  stone: ['Diamond','Sapphire','Emerald','Ruby','Morganite','Moissanite'],
  shape: ['Round','Princess','Oval','Cushion','Marquise','Pear','Emerald cut','Radiant'],
  carat: ['0.5 ct','0.75 ct','1.0 ct','1.5 ct','2.0 ct','2.5+ ct'],
  setting: ['Solitaire','Halo','Pavé','Three Stone','Bezel','Vintage'],
  metal: ['Yellow Gold','White Gold','Rose Gold','Platinum','Two-Tone'],
  band: ['Plain','Twisted','Eternity','Milgrain','Cathedral','Split Shank'],
  enh: ['Engraving','Side stones','Filigree','Conflict-free cert.','Hidden halo','Rush production'],
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const business_name = (body.business_name || '').trim()
  const subdomain = (body.subdomain || '').trim().toLowerCase()
  const email = (body.email || '').trim().toLowerCase()
  const password = body.password || ''
  const plan = (body.plan || 'starter') as BillablePlan

  if (!business_name || !subdomain || !email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }
  if (!/^[a-z0-9-]{3,30}$/.test(subdomain)) {
    return NextResponse.json({ error: 'Subdomain must be 3-30 lowercase letters, numbers, or hyphens.' }, { status: 400 })
  }
  if (RESERVED.includes(subdomain)) {
    return NextResponse.json({ error: 'That subdomain is reserved. Please choose another.' }, { status: 400 })
  }
  if (!PRICE_IDS[plan]) {
    return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 })
  }

  const supabase = getServiceClient()

  // Check subdomain uniqueness
  const { data: existing } = await supabase
    .from('accounts')
    .select('id')
    .eq('subdomain', subdomain)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'That subdomain is already taken. Please choose another.' }, { status: 400 })
  }

  // Create the Supabase auth user
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (authError || !authUser?.user) {
    return NextResponse.json({ error: authError?.message || 'Could not create your login.' }, { status: 400 })
  }

  // Create the account
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .insert({
      email,
      business_name,
      subdomain,
      plan: 'trial',
      status: 'trial',
    })
    .select()
    .single()

  if (accountError || !account) {
    return NextResponse.json({ error: accountError?.message || 'Could not create your account.' }, { status: 400 })
  }

  // Link the user to the account as owner
  await supabase.from('account_users').insert({
    account_id: account.id,
    user_id: authUser.user.id,
    role: 'owner',
  })

  // Seed default ring options
  const rows: any[] = []
  Object.entries(DEFAULT_OPTIONS).forEach(([step_key, labels]) => {
    labels.forEach((label, i) => {
      rows.push({ account_id: account.id, step_key, label, sort_order: i + 1 })
    })
  })
  await supabase.from('step_options').insert(rows)

  // Log them in for real — set the session cookie on the response we return
  const response = NextResponse.json({ data: { url: '' } })

  const ssrClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  const { error: signInError } = await ssrClient.auth.signInWithPassword({ email, password })
  if (signInError) {
    return NextResponse.json({ error: 'Account created, but could not log you in. Please try logging in manually.' }, { status: 500 })
  }

  // Create the Stripe Checkout session
  const origin = req.nextUrl.origin
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { account_id: account.id, plan },
    },
    payment_method_collection: 'always',
    success_url: `${origin}/admin/dashboard?welcome=true`,
    cancel_url: `${origin}/admin/dashboard?billing=cancelled`,
    metadata: { account_id: account.id, plan },
  })

  const finalBody = { data: { url: session.url } }
  return NextResponse.json(finalBody, { headers: response.headers })
}
