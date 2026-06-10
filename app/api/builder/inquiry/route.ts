import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const year = new Date().getFullYear()
  const rand = String(Math.floor(Math.random() * 90000) + 10000)
  const reference_code = `RNG-${year}-${rand}`

  const { data: inquiry, error } = await supabase
    .from('inquiries')
    .insert({
      account_id: body.account_id,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone || null,
      ring_type: body.ring_type || null,
      selections: body.selections || {},
      ring_size: body.ring_size || null,
      band_width: body.band_width || null,
      budget_range: body.budget_range || null,
      timeline: body.timeline || null,
      notes: body.notes || null,
      source_url: body.source_url || null,
      reference_code,
    })
    .select()
    .single()

  if (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { reference_code: inquiry.reference_code, id: inquiry.id } }, { status: 201 })
}
