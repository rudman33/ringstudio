import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jeweleryengine.com'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/reset-password`,
  })
  if (resetError) {
    console.log('DEBUG forgot-password error:', resetError.message)
  }

  // Always return success regardless of whether the email exists, to avoid leaking which emails are registered
  return NextResponse.json({ success: true })
}
