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
    .from('inquiries')
    .select('*')
    .eq('account_id', result.accountId)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const result = await getAccountId()
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const { id, status } = await req.json()
  const supabase = getClient()
  // Scope the update to this account too, so one jeweler can never edit another's inquiry by guessing an id
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .eq('account_id', result.accountId)
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
