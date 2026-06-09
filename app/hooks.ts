// hooks/useBuilderConfig.ts
// Fetches the full builder config (steps + options + branding)
// for a given subdomain. Called once on mount.

'use client'
import { useState, useEffect } from 'react'
import type { BuilderConfig } from './types'

export function useBuilderConfig(subdomain: string) {
  const [config, setConfig] = useState<BuilderConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/builder/config?subdomain=${subdomain}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to load')
        setConfig(json.data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load builder')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [subdomain])

  return { config, loading, error }
}

// ──────────────────────────────────────────────────────────

// hooks/useInquiries.ts
// Fetches inquiries for the logged-in jeweler's admin panel.

import { createClient } from './lib/supabase-client'
import type { Inquiry, InquiryStatus } from './types'

export function useInquiries(filters?: { status?: InquiryStatus }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let query = supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query
      if (!error && data) setInquiries(data)
      setLoading(false)
    }
    load()
  }, [filters?.status])

  return { inquiries, loading, refetch: () => {} }
}

// ──────────────────────────────────────────────────────────

// hooks/useAccount.ts
// Returns the current jeweler's account details.

export function useAccount() {
  const [account, setAccount] = useState<{ id: string; business_name: string; plan: string } | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('account_users')
        .select('accounts(id, business_name, plan, status, brand_color, logo_url)')
        .eq('user_id', user.id)
        .single()

      if (data?.accounts) setAccount(data.accounts as any)
    }
    load()
  }, [])

  return { account }
}
