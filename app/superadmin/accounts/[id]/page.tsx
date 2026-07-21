"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

const G="#B5966D",INK="#1C1612",INKS="#9C8470",W="#FFFFFF",BDRS="rgba(181,150,109,0.35)"

const FIELDS: [string,string][] = [
  ["business_name","Business name"],
  ["notification_email","Notification email"],
  ["logo_url","Logo URL"],
  ["brand_color","Brand colour (hex)"],
  ["bg_color","Background colour"],
  ["text_color","Text colour"],
  ["button_color","Button colour"],
  ["calendly_url","Calendly URL"],
]

export default function ConfigureAccountPage() {
  const params = useParams()
  const id = String(params?.id || "")
  const [form, setForm] = useState<any>(null)
  const [options, setOptions] = useState<any[]>([])
  const [msg, setMsg] = useState("")
  const [saving, setSaving] = useState(false)

  const inp = {width:"100%",padding:"9px 12px",fontSize:14,border:"1px solid "+BDRS,borderRadius:8,background:W,color:INK,outline:"none",fontFamily:"inherit",marginBottom:14} as any

  useEffect(() => {
    if (!id) return
    fetch("/api/superadmin/accounts/" + id)
      .then(r => r.json())
      .then(j => {
        if (j.error) { setMsg("Error: " + j.error); return }
        setForm(j.data); setOptions(j.options || [])
      })
      .catch(() => setMsg("Could not load this account."))
  }, [id])

  const save = async () => {
    setSaving(true); setMsg("")
    const payload: any = {}
    FIELDS.forEach(([k]) => { payload[k] = form[k] ?? null })
    const res = await fetch("/api/superadmin/accounts/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const j = await res.json()
    setSaving(false)
    setMsg(res.ok ? "Saved." : "Error: " + (j.error || "unknown"))
  }

  if (!form) {
    return <div style={{padding:32,fontFamily:"Georgia,serif",color:INK}}>{msg || "Loading..."}</div>
  }

  const grouped: Record<string, any[]> = {}
  options.forEach(o => { (grouped[o.step_key] = grouped[o.step_key] || []).push(o) })

  return (
    <div style={{padding:"32px",maxWidth:720,margin:"0 auto",fontFamily:"system-ui,sans-serif"}}>
      <a href="/superadmin" style={{fontSize:13,color:INKS}}>&larr; Back to platform overview</a>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:28,color:INK,margin:"12px 0 4px"}}>{form.business_name}</h1>
      <div style={{fontSize:13,color:INKS,marginBottom:24}}>
        {form.subdomain}.jeweleryengine.com &middot; {form.plan} &middot; {form.status}
      </div>

      {msg && <div style={{padding:"10px 14px",borderRadius:8,marginBottom:16,fontSize:13,
        background: msg.startsWith("Error") ? "#FFF0F0" : "#F0FFF4",
        color: msg.startsWith("Error") ? "#C0392B" : "#0F6E56"}}>{msg}</div>}

      {FIELDS.map(([key,label]) => (
        <div key={key}>
          <label style={{display:"block",fontSize:11,color:INKS,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{label}</label>
          <input style={inp} value={form[key] ?? ""} onChange={e=>setForm({...form,[key]:e.target.value})}/>
        </div>
      ))}

      <button onClick={save} disabled={saving}
        style={{background:G,border:"none",borderRadius:8,padding:"11px 20px",fontSize:14,color:"#fff",cursor:"pointer",opacity:saving?.6:1}}>
        {saving ? "Saving..." : "Save changes"}
      </button>

      <a href={"/" + form.subdomain} target="_blank" rel="noreferrer"
        style={{marginLeft:12,fontSize:13,color:G}}>View builder &#8599;</a>

      <h2 style={{fontFamily:"Georgia,serif",fontSize:20,color:INK,margin:"36px 0 12px"}}>
        Ring options ({options.length})
      </h2>
      {Object.keys(grouped).sort().map(step => (
        <div key={step} style={{marginBottom:16}}>
          <div style={{fontSize:11,color:INKS,textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>{step}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {grouped[step].map(o => (
              <span key={o.id} style={{fontSize:13,padding:"5px 10px",borderRadius:6,border:"1px solid "+BDRS,color:INK,opacity:o.is_active?1:.45}}>
                {o.label}{o.image_url ? "" : " (no image)"}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
