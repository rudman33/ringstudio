import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get('subdomain')
  if (!subdomain) return NextResponse.json({ error: 'subdomain required' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: account } = await supabase
    .from('accounts')
    .select('id, business_name, logo_url, brand_color, calendly_url')
    .eq('subdomain', subdomain)
    .single()

  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  const { data: options } = await supabase
    .from('step_options')
    .select('*')
    .eq('account_id', account.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const grouped = (options || []).reduce((acc: any, opt: any) => {
    if (!acc[opt.step_key]) acc[opt.step_key] = []
    acc[opt.step_key].push(opt)
    return acc
  }, {})

  return NextResponse.json({ data: { account, options: grouped } })
}
