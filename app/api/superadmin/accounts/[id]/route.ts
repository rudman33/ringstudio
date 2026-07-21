import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireSuperadmin } from '../../../../../lib/require-superadmin'

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const EDITABLE = [
  'business_name','notification_email','logo_url','brand_color',
  'bg_color','text_color','button_color','calendly_url','plan','status',
]

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const supabase = admin()

  const { data, error } = await supabase.from('accounts').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  const { data: options } = await supabase
    .from('step_options')
    .select('id, step_key, label, image_url, is_active, sort_order')
    .eq('account_id', id)
    .order('step_key', { ascending: true })
    .order('sort_order', { ascending: true })

  return NextResponse.json({ data, options: options || [] })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const body = await req.json()

  const patch: Record<string, any> = {}
  for (const key of EDITABLE) {
    if (key in body) patch[key] = body[key]
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No editable fields supplied' }, { status: 400 })
  }
  patch.updated_at = new Date().toISOString()

  const supabase = admin()
  const { data, error } = await supabase
    .from('accounts').update(patch).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
