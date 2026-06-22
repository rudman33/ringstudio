import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAccountId } from '../../../../lib/get-account'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const result = await getAccountId()
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const supabase = getClient()
  const { data, error } = await supabase
    .from('step_options')
    .select('*')
    .eq('account_id', result.accountId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const grouped = (data || []).reduce((acc: any, opt: any) => {
    if (!acc[opt.step_key]) acc[opt.step_key] = []
    acc[opt.step_key].push(opt)
    return acc
  }, {})
  return NextResponse.json({ data: grouped })
}

export async function POST(req: NextRequest) {
  const result = await getAccountId()
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const body = await req.json()
  const supabase = getClient()
  const { data, error } = await supabase
    .from('step_options')
    .insert({
      account_id: result.accountId,
      step_key: body.step_key,
      label: body.label,
      description: body.description || null,
      color_hex: body.color_hex || null,
      image_url: body.image_url || null,
      sort_order: body.sort_order || 99
    })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const result = await getAccountId()
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const body = await req.json()
  const supabase = getClient()
  // Scope to this account so one jeweler can't edit another's options by guessing an id
  const { data, error } = await supabase
    .from('step_options')
    .update({
      label: body.label,
      description: body.description || null,
      color_hex: body.color_hex || null,
      image_url: body.image_url || null
    })
    .eq('id', body.id)
    .eq('account_id', result.accountId)
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const result = await getAccountId()
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const body = await req.json()
  const supabase = getClient()
  const { error } = await supabase
    .from('step_options')
    .delete()
    .eq('id', body.id)
    .eq('account_id', result.accountId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
