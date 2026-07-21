import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireSuperadmin } from '../../../../../../lib/require-superadmin'

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Create a new option for this account
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const body = await req.json()
  if (!body.step_key || !body.label) {
    return NextResponse.json({ error: 'step_key and label are required' }, { status: 400 })
  }

  const { data, error } = await admin().from('step_options').insert({
    account_id: id,
    step_key: body.step_key,
    label: body.label,
    image_url: body.image_url || null,
    sort_order: body.sort_order ?? 99,
    is_active: body.is_active ?? true,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// Update one option
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const body = await req.json()
  if (!body.option_id) return NextResponse.json({ error: 'option_id required' }, { status: 400 })

  const patch: Record<string, any> = { updated_at: new Date().toISOString() }
  for (const k of ['label','image_url','is_active','sort_order']) {
    if (k in body) patch[k] = body[k]
  }

  const { data, error } = await admin()
    .from('step_options')
    .update(patch)
    .eq('id', body.option_id)
    .eq('account_id', id)
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// Delete one option. Only removes the database row -- never touches storage,
// because seeded images are shared across every account.
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const optionId = searchParams.get('option_id')
  if (!optionId) return NextResponse.json({ error: 'option_id required' }, { status: 400 })

  const { error } = await admin()
    .from('step_options').delete().eq('id', optionId).eq('account_id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
