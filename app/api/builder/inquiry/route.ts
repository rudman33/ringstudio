import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  // Look up the actual jeweler account so notifications go to the right inbox
  const { data: account } = await supabase
    .from('accounts')
    .select('notification_email, email, business_name')
    .eq('id', body.account_id)
    .single()

  const jewelerEmail = account?.notification_email || account?.email

  // Email to jeweler
  const sel = body.selections || {}
  const jewelerHtml = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:2rem;background:#F8F3EC;">
      <div style="background:#fff;border-radius:12px;padding:2rem;border:1px solid rgba(181,150,109,0.2)">
        <h1 style="color:#1C1612;font-weight:300;font-size:28px;margin:0 0 4px">New ring inquiry</h1>
        <p style="color:#9C8470;margin:0 0 24px;font-size:14px">Reference: <strong style="color:#B5966D">${reference_code}</strong></p>
        
        <h3 style="color:#B5966D;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 12px">Customer</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;color:#9C8470;font-size:13px">Name</td><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;font-size:13px;font-weight:500">${body.customer_name}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;color:#9C8470;font-size:13px">Email</td><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;font-size:13px;font-weight:500">${body.customer_email}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;color:#9C8470;font-size:13px">Phone</td><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;font-size:13px;font-weight:500">${body.customer_phone || '—'}</td></tr>
        </table>
        
        <h3 style="color:#B5966D;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 12px">Ring design</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${[['Type',body.ring_type],['Stone',sel.stone],['Shape',sel.shape],['Carat',sel.carat],['Setting',sel.setting],['Metal',sel.metal],['Band',sel.band],['Budget',body.budget_range],['Timeline',body.timeline],['Ring size',body.ring_size]].filter(([,v])=>v).map(([k,v])=>`<tr><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;color:#9C8470;font-size:13px">${k}</td><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;font-size:13px;font-weight:500">${v}</td></tr>`).join('')}
        </table>
        
        ${body.notes ? `<h3 style="color:#B5966D;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 8px">Notes</h3><p style="font-size:13px;color:#5A4A3A;background:#FAF5EE;padding:12px;border-radius:8px;margin:0 0 24px">${body.notes}</p>` : ''}
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ringstudio-git-main-rudman33s-projects.vercel.app'}/admin/dashboard" style="display:inline-block;background:#B5966D;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">View in admin panel</a>
      </div>
    </div>
  `

  // Email to customer
  const customerHtml = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:2rem;background:#F8F3EC;">
      <div style="background:#fff;border-radius:12px;padding:2rem;border:1px solid rgba(181,150,109,0.2)">
        <h1 style="color:#1C1612;font-weight:300;font-size:28px;margin:0 0 4px">Your ring inquiry</h1>
        <p style="color:#9C8470;margin:0 0 24px;font-size:14px">Thank you for submitting your design. We'll be in touch within 24 hours.</p>
        
        <div style="background:#FAF5EE;border-radius:10px;padding:16px;margin-bottom:24px;text-align:center">
          <div style="font-size:11px;color:#9C8470;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Your reference</div>
          <div style="font-size:24px;color:#B5966D;font-weight:400">${reference_code}</div>
        </div>
        
        <h3 style="color:#B5966D;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 12px">Your design</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${[['Ring type',body.ring_type],['Stone',sel.stone],['Shape',sel.shape],['Carat',sel.carat],['Setting',sel.setting],['Metal',sel.metal],['Band',sel.band]].filter(([,v])=>v).map(([k,v])=>`<tr><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;color:#9C8470;font-size:13px">${k}</td><td style="padding:8px 0;border-bottom:1px solid #f0e8dc;font-size:13px;font-weight:500">${v}</td></tr>`).join('')}
        </table>
        
        <p style="font-size:13px;color:#9C8470;margin:0">Keep this email for your records. A jewellery specialist will contact you shortly.</p>
      </div>
    </div>
  `

  // Send emails (don't block the response if they fail)
  try {
    const emailPromises = []
    if (jewelerEmail) {
      emailPromises.push(resend.emails.send({
        from: 'Jewelry Engine <notifications@jeweleryengine.com>',
        to: [jewelerEmail],
        subject: `New ring inquiry — ${reference_code}`,
        html: jewelerHtml,
      }))
    } else {
      console.error('No notification email on file for account', body.account_id)
    }
    emailPromises.push(resend.emails.send({
      from: 'Jewelry Engine <notifications@jeweleryengine.com>',
      to: [body.customer_email],
      subject: `Your ring inquiry — ${reference_code}`,
      html: customerHtml,
    }))
    await Promise.all(emailPromises)
  } catch (emailError) {
    console.error('Email error:', emailError)
  }

  return NextResponse.json({ data: { reference_code: inquiry.reference_code, id: inquiry.id } }, { status: 201 })
}
