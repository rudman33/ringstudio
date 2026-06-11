import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('account_id', '8433f769-632e-4426-b07b-0f5c9e7a2fe6')
    .order('created_at', { ascending: false })
  if(error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
