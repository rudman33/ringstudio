'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const G='#B5966D',INK='#1C1612',INKS='#9C8470',W='#FFFFFF',BDR='rgba(181,150,109,0.18)',BDRS='rgba(181,150,109,0.35)'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login'|'signup'|'reset'>('login')
  const [success, setSuccess] = useState('')

  const inp = {width:'100%',padding:'10px 14px',fontSize:14,border:'1px solid '+BDRS,borderRadius:8,background:W,color:INK,outline:'none',fontFamily:'inherit',marginBottom:12} as any

  const handleLogin = async () => {
    if(!email||!password){setError('Please enter your email and password.');return}
    setLoading(true);setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if(error){setError(error.message);setLoading(false);return}
    window.location.href = '/admin/dashboard'
  }

  const handleSignup = async () => {
    if(!email||!password){setError('Please enter your email and password.');return}
    if(password.length < 6){setError('Password must be at least 6 characters.');return}
    setLoading(true);setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if(error){setError(error.message);setLoading(false);return}
    setSuccess('Check your email to confirm your account.')
    setLoading(false)
  }

  const handleReset = async () => {
    if(!email){setError('Please enter your email.');return}
    setLoading(true);setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth/update-password'
    })
    if(error){setError(error.message);setLoading(false);return}
    setSuccess('Password reset link sent — check your email.')
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#F8F3EC',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{fontFamily:'Georgia,serif',fontSize:24,color:INK,marginBottom:32}}>
        Ring<span style={{color:G}}>Studio</span>
      </div>
      <div style={{background:W,border:'1px solid '+BDR,borderRadius:16,padding:'2rem',width:'100%',maxWidth:380}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:22,fontWeight:300,color:INK,marginBottom:6}}>
          {mode==='login'?'Sign in':mode==='signup'?'Create account':'Reset password'}
        </div>
        <div style={{fontSize:13,color:INKS,marginBottom:24}}>
          {mode==='login'?'Access your jeweler admin panel':mode==='signup'?'Start your free 14-day trial':'We\'ll send you a reset link'}
        </div>

        {error && <div style={{background:'#FFF0F0',border:'1px solid #FFD0D0',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#C0392B',marginBottom:16}}>{error}</div>}
        {success && <div style={{background:'#F0FFF4',border:'1px solid #A8DFC8',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#0F6E56',marginBottom:16}}>{success}</div>}

        <div>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Email</label>
          <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e=>e.key==='Enter'&&mode==='login'&&handleLogin()}/>
        </div>

        {mode !== 'reset' && (
          <div>
            <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Password</label>
            <input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&mode==='login'&&handleLogin()}/>
          </div>
        )}

        <button
          onClick={mode==='login'?handleLogin:mode==='signup'?handleSignup:handleReset}
          disabled={loading}
          style={{width:'100%',background:G,border:'none',borderRadius:8,padding:'11px',fontSize:14,fontWeight:500,color:'#fff',cursor:'pointer',fontFamily:'inherit',opacity:loading?.6:1,marginBottom:16}}
        >
          {loading?'Please wait…':mode==='login'?'Sign in':mode==='signup'?'Create account':'Send reset link'}
        </button>

        <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
          {mode==='login'&&<>
            <button onClick={()=>{setMode('reset');setError('');setSuccess('')}} style={{background:'none',border:'none',fontSize:13,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>Forgot your password?</button>
            <button onClick={()=>{setMode('signup');setError('');setSuccess('')}} style={{background:'none',border:'none',fontSize:13,color:G,cursor:'pointer',fontFamily:'inherit'}}>Don't have an account? Sign up</button>
          </>}
          {mode!=='login'&&<button onClick={()=>{setMode('login');setError('');setSuccess('')}} style={{background:'none',border:'none',fontSize:13,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>← Back to sign in</button>}
        </div>
      </div>
      <div style={{marginTop:16,fontSize:12,color:INKS}}>Ring Studio — White-label ring builder platform</div>
    </div>
  )
}
