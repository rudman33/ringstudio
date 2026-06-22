'use client'
import { useState } from 'react'

const G='#B5966D',GD='#8A6D48',GP='#FAF5EE',INK='#1C1612',INKS='#9C8470',W='#FFFFFF',BDR='rgba(181,150,109,0.18)',BDRS='rgba(181,150,109,0.35)'

const PLANS = [
  { key: 'starter', label: 'Starter', price: '$49', desc: 'Get started with the essentials.' },
  { key: 'pro', label: 'Pro', price: '$99', desc: 'Most popular for growing studios.' },
  { key: 'enterprise', label: 'Enterprise', price: '$249', desc: 'Full feature set, priority support.' },
]

export default function SignupPage() {
  const [form, setForm] = useState({ business_name: '', subdomain: '', email: '', password: '' })
  const [plan, setPlan] = useState('starter')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const inp = { width: '100%', padding: '10px 12px', fontSize: 14, border: '1px solid '+BDRS, borderRadius: 8, background: W, color: INK, outline: 'none', fontFamily: 'inherit' } as any
  const label = { display: 'block', fontSize: 11, color: INKS, textTransform: 'uppercase' as any, letterSpacing: '.07em', marginBottom: 4 }

  async function submit(e: any) {
    e.preventDefault()
    setError('')
    if (!form.business_name.trim() || !form.subdomain.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subdomain: form.subdomain.trim().toLowerCase(), plan }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      window.location.href = json.data.url
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: INK }}>Ring<span style={{ color: G }}>Studio</span></div>
          <div style={{ fontSize: 13, color: INKS, marginTop: 4 }}>Start your 14-day free trial</div>
        </div>

        <form onSubmit={submit} style={{ background: W, border: '1px solid '+BDR, borderRadius: 14, padding: '1.75rem' }}>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>Business name</label>
            <input style={inp} value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Example Jewellers" />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={label}>Choose your subdomain</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                style={{ ...inp, flex: 1 }}
                value={form.subdomain}
                onChange={e => set('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="example"
              />
            </div>
            <div style={{ fontSize: 11, color: INKS, marginTop: 4 }}>Lowercase letters, numbers, and hyphens only.</div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={label}>Email</label>
            <input style={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={label}>Password</label>
            <input style={inp} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="At least 8 characters" />
          </div>

          <label style={label}>Choose a plan</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
            {PLANS.map(p => (
              <div
                key={p.key}
                onClick={() => setPlan(p.key)}
                style={{
                  border: plan === p.key ? '2px solid '+G : '1px solid '+BDR,
                  background: plan === p.key ? GP : W,
                  borderRadius: 10,
                  padding: '10px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 500, color: INK }}>{p.label}</div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: G, margin: '2px 0' }}>{p.price}</div>
                <div style={{ fontSize: 10, color: INKS }}>/month</div>
              </div>
            ))}
          </div>

          {error && <div style={{ fontSize: 12, color: '#C0392B', marginBottom: 12, textAlign: 'center' }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#C8B8A8' : G, border: 'none', borderRadius: 8,
              padding: 13, fontSize: 14, fontWeight: 500, color: '#fff',
              cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
            }}
          >
            {loading ? 'Setting up your account…' : 'Continue to payment →'}
          </button>

          <div style={{ fontSize: 11, color: INKS, textAlign: 'center', marginTop: 12 }}>
            You won\'t be charged until your 14-day trial ends.
          </div>
        </form>
      </div>
    </div>
  )
}
