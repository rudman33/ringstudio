import { NextResponse } from 'next/server'
import { requireSuperadmin } from '../../../../lib/require-superadmin'

// Lightweight check used by the login page to decide where to send the user.
export async function GET() {
  const auth = await requireSuperadmin()
  return NextResponse.json({ isSuperadmin: !('error' in auth) })
}
