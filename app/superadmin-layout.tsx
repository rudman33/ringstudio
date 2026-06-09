// app/(superadmin)/superadmin/layout.tsx
// Auth guard for the super admin panel (you only).

import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabase-server'

interface Props {
  children: React.ReactNode
}

export default async function SuperAdminLayout({ children }: Props) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/superadmin')

  // Verify the user is in the super_admins table
  const { data: superAdmin } = await supabase
    .from('super_admins')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!superAdmin) redirect('/?error=unauthorized')

  return <>{children}</>
}
