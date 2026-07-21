import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireSuperadmin } from '../../../../lib/require-superadmin'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const supabase = getClient()
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Tally inquiry counts per account
  const { data: inquiryRows } = await supabase
    .from('inquiries')
    .select('account_id')

  const inquiryCounts: Record<string, number> = {}
  for (const row of inquiryRows || []) {
    inquiryCounts[row.account_id] = (inquiryCounts[row.account_id] || 0) + 1
  }

  const enriched = (data || []).map((acc: any) => ({
    ...acc,
    inquiry_count: inquiryCounts[acc.id] || 0,
  }))

  return NextResponse.json({ data: enriched })
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await req.json()
  const supabase = getClient()

  const { data, error } = await supabase
    .from('accounts')
    .insert({
      email: body.email,
      business_name: body.business_name,
      subdomain: body.subdomain,
      plan: body.plan || 'trial',
      status: body.plan === 'trial' ? 'trial' : 'active',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Default builder steps and ring options are seeded by the database
  // trigger `on_account_created_seed_defaults`. Seeding here as well
  // produced duplicate options in every new jeweler's builder.

  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await req.json()
  const supabase = getClient()
  const { data, error } = await supabase
    .from('accounts')
    .update({ status: body.status })
    .eq('id', body.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}