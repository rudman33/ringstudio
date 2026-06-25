import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const PLAN_LIMITS: Record<string, number> = {
  starter: 100,
  pro: 500,
  enterprise: Infinity,
  trial: 100,
  free: 100,
}

type CreditCheckResult = { allowed: true } | { allowed: false; reason: string }

export async function checkAndConsumeDesignCredit(accountId: string): Promise<CreditCheckResult> {
  const supabase = getServiceClient()

  const { data: account, error } = await supabase
    .from('accounts')
    .select('plan, designs_used_this_period, extra_designs_purchased, period_reset_at')
    .eq('id', accountId)
    .single()

  if (error || !account) {
    return { allowed: false, reason: 'Account not found' }
  }

  let used = account.designs_used_this_period || 0
  let resetAt = account.period_reset_at ? new Date(account.period_reset_at) : new Date(0)
  const now = new Date()

  // Rolling 30-day window — reset usage once the window has passed
  if (now > resetAt) {
    used = 0
    const newResetAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    await supabase
      .from('accounts')
      .update({ designs_used_this_period: 0, period_reset_at: newResetAt.toISOString() })
      .eq('id', accountId)
    resetAt = newResetAt
  }

  const limit = PLAN_LIMITS[account.plan] ?? PLAN_LIMITS.starter
  const extra = account.extra_designs_purchased || 0
  const allowance = limit === Infinity ? Infinity : limit + extra

  if (used >= allowance) {
    return { allowed: false, reason: 'Design limit reached for this billing period' }
  }

  // Consume one credit
  await supabase
    .from('accounts')
    .update({ designs_used_this_period: used + 1 })
    .eq('id', accountId)

  return { allowed: true }
}
