import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ACCOUNT_ID = '8433f769-632e-4426-b07b-0f5c9e7a2fe6'

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
    .eq('id', ACCOUNT_ID)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const supabase = getClient()
  const { data, error } = await supabase
    .from('accounts')
    .update({ calendly_url: body.calendly_url })
    .eq('id', ACCOUNT_ID)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}