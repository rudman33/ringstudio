import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
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

  // Seed default options for the new account
  const defaultOptions = {
    stone: ['Diamond','Sapphire','Emerald','Ruby','Morganite','Moissanite'],
    shape: ['Round','Princess','Oval','Cushion','Marquise','Pear','Emerald cut','Radiant'],
    carat: ['0.5 ct','0.75 ct','1.0 ct','1.5 ct','2.0 ct','2.5+ ct'],
    setting: ['Solitaire','Halo','Pavé','Three Stone','Bezel','Vintage'],
    metal: ['Yellow Gold','White Gold','Rose Gold','Platinum','Two-Tone'],
    band: ['Plain','Twisted','Eternity','Milgrain','Cathedral','Split Shank'],
    enh: ['Engraving','Side stones','Filigree','Conflict-free cert.','Hidden halo','Rush production'],
  }

  const rows: any[] = []
  Object.entries(defaultOptions).forEach(([step_key, labels]) => {
    labels.forEach((label, i) => {
      rows.push({ account_id: data.id, step_key, label, sort_order: i + 1 })
    })
  })
  await supabase.from('step_options').insert(rows)

  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
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