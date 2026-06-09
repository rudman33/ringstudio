// app/(admin)/admin/layout.tsx
// Auth guard for the jeweler admin panel.
// Redirects to /auth/login if not authenticated.

import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabase-server'

interface Props {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/admin/dashboard')

  // Check the user belongs to an account
  const { data: accountUser } = await supabase
    .from('account_users')
    .select('account_id, role, accounts(id, business_name, status)')
    .eq('user_id', user.id)
    .single()

  if (!accountUser) redirect('/auth/login?error=no_account')

  return <>{children}</>
}
