"use client"
import { useState, useEffect } from "react"
import { createClient } from "../../../lib/supabase-client"

const G="#B5966D",INK="#1C1612",INKS="#9C8470",W="#FFFFFF",BDR="rgba(181,150,109,0.18)",BDRS="rgba(181,150,109,0.35)"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  const inp = {width:"100%",padding:"10px 14px",fontSize:14,border:"1px solid "+BDRS,borderRadius:8,background:W,color:INK,outline:"none",fontFamily:"inherit",marginBottom:12} as any

  useEffect(() => {
    const supabase = createClient()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) { setReady(true); setSessionError(false) }
    })
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) { setReady(true); return }
      setTimeout(() => {
        supabase.auth.getSession().then(({ data: again }) => {
          if (again.session) setReady(true)
          else setSessionError(true)
        })
      }, 1500)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const handleSubmit = async () => {
    if (!password || !confirmPassword) { setError("Please fill in both fields."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    if (password !== confirmPassword) { setError("Passwords do not match."); return }

    setLoading(true); setError("")
    const supabase = createClient()
    const { data, error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) { setError(updateError.message); return }
    if (!data || !data.user) {
      setError("The password was not saved. Please request a new reset link and try again.")
      return
    }
    setSuccess(true)
    setTimeout(() => { window.location.href = "/auth/login" }, 2500)
  }

  return (
    <div style={{minHeight:"100vh",background:"#F8F3EC",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:24,color:INK,marginBottom:32}}>Jewelry<span style={{color:G}}>Engine</span></div>
      <div style={{background:W,border:"1px solid "+BDR,borderRadius:16,padding:"2rem",width:"100%",maxWidth:380}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:300,color:INK,marginBottom:6}}>Set a new password</div>

        {sessionError && (
          <div style={{background:"#FFF0F0",border:"1px solid #FFD0D0",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#C0392B",marginBottom:16}}>
            This reset link is invalid or has expired. Please request a new one from the sign-in page.
          </div>
        )}

        {success && (
          <div style={{background:"#F0FFF4",border:"1px solid #A8DFC8",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#0F6E56",marginBottom:16}}>
            Password updated. Redirecting you to sign in...
          </div>
        )}

        {error && (
          <div style={{background:"#FFF0F0",border:"1px solid #FFD0D0",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#C0392B",marginBottom:16}}>{error}</div>
        )}

        {!ready && !sessionError && !success && (
          <div style={{fontSize:13,color:INKS,marginTop:8}}>Checking your reset link...</div>
        )}

        {ready && !success && (
          <>
            <div>
              <label style={{display:"block",fontSize:11,color:INKS,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>New password</label>
              <input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="********"/>
            </div>
            <div>
              <label style={{display:"block",fontSize:11,color:INKS,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Confirm new password</label>
              <input style={inp} type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="********" onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
            <button onClick={handleSubmit} disabled={loading}
              style={{width:"100%",background:G,border:"none",borderRadius:8,padding:"11px",fontSize:14,fontWeight:500,color:"#fff",cursor:"pointer",fontFamily:"inherit",opacity:loading?.6:1}}>
              {loading?"Saving...":"Save new password"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
