// GET /api/builder/config?subdomain=tiffany
// Returns the full builder config for a given jeweler subdomain.
// Called once when the ring builder page loads.

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '../../../lib/supabase-server'
import type { BuilderConfig, ApiResponse } from '../../../types'

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get('subdomain')

  if (!subdomain) {
    return NextResponse.json<ApiResponse>({ error: 'subdomain required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // 1. Load account by subdomain (or custom_domain)
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('id, business_name, logo_url, brand_color, status, plan')
    .or(`subdomain.eq.${subdomain},custom_domain.eq.${subdomain}`)
    .single()

  if (accountError || !account) {
    return NextResponse.json<ApiResponse>({ error: 'Account not found' }, { status: 404 })
  }

  if (account.status === 'suspended' || account.status === 'cancelled') {
    return NextResponse.json<ApiResponse>({ error: 'Account inactive' }, { status: 403 })
  }

  // 2. Load visible steps in order
  const { data: steps, error: stepsError } = await supabase
    .from('builder_steps')
    .select('*')
    .eq('account_id', account.id)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (stepsError) {
    return NextResponse.json<ApiResponse>({ error: 'Failed to load steps' }, { status: 500 })
  }

  // 3. Load active options for all steps
  const { data: options, error: optionsError } = await supabase
    .from('step_options')
    .select('*')
    .eq('account_id', account.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (optionsError) {
    return NextResponse.json<ApiResponse>({ error: 'Failed to load options' }, { status: 500 })
  }

  // 4. Group options by step_key
  const groupedOptions = (options || []).reduce(
    (acc, opt) => {
      if (!acc[opt.step_key]) acc[opt.step_key] = []
      acc[opt.step_key].push(opt)
      return acc
    },
    {} as BuilderConfig['options']
  )

  const config: BuilderConfig = {
    account,
    steps: steps || [],
    options: groupedOptions,
  }

  return NextResponse.json<ApiResponse<BuilderConfig>>({ data: config })
}
