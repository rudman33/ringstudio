import { createClient } from './supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Looks up which account the CURRENTLY LOGGED IN user belongs to.
// Use this in every /api/admin/* route instead of a hardcoded account ID.
type AccountIdResult = { accountId: string } | { error: string; status: number }

export async function getAccountId(): Promise<AccountIdResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', status: 401 }
  }

  const service = getServiceClient()
  const { data: accountUser } = await service
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  if (!accountUser) {
    return { error: 'No account linked to this user', status: 403 }
  }

  return { accountId: accountUser.account_id }
}
