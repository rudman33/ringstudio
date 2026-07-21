import { createClient as createServerSupabase } from './supabase-server'
import { createClient } from '@supabase/supabase-js'

// Verifies the logged-in user is a superadmin.
// Source of truth is the `super_admins` table, so access can be granted or
// revoked with a database row -- no env var edit, no redeploy.
// SUPERADMIN_EMAIL is still honoured as a fallback for backwards compatibility.
type SuperadminResult = { ok: true; userId: string } | { error: string; status: number }

export async function requireSuperadmin(): Promise<SuperadminResult> {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', status: 401 }
  }

  const allowedEmail = process.env.SUPERADMIN_EMAIL
  if (allowedEmail && user.email === allowedEmail) {
    return { ok: true, userId: user.id }
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await admin
    .from('super_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return { error: 'Authorization check failed', status: 500 }
  }
  if (!data) {
    return { error: 'Not authorized', status: 403 }
  }

  return { ok: true, userId: user.id }
}
