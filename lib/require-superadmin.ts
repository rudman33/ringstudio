import { createClient } from './supabase-server'

// Verifies the currently logged-in user is the designated superadmin.
// Use this at the top of every /api/superadmin/* route.
type SuperadminResult = { ok: true } | { error: string; status: number }

export async function requireSuperadmin(): Promise<SuperadminResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', status: 401 }
  }

  const allowedEmail = process.env.SUPERADMIN_EMAIL
  if (!allowedEmail || user.email !== allowedEmail) {
    return { error: 'Not authorized', status: 403 }
  }

  return { ok: true }
}
