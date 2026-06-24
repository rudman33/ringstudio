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
    .from('accounts')
    .select('*')
    .eq('id', result.accountId)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const result = await getAccountId()
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const body = await req.json()
  const supabase = getClient()
  const updatePayload: Record<string, unknown> = {}
  if (body.calendly_url !== undefined) updatePayload.calendly_url = body.calendly_url
  if (body.notification_email !== undefined) updatePayload.notification_email = body.notification_email
  if (body.brand_color !== undefined) updatePayload.brand_color = body.brand_color

  const { data, error } = await supabase
    .from('accounts')
    .update(updatePayload)
    .eq('id', result.accountId)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
