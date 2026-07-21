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

  const updateLocal = (optionId: string, patch: any) => {
    setOptions(prev => prev.map(o => o.id === optionId ? { ...o, ...patch } : o))
  }

  const saveOption = async (o: any) => {
    const res = await fetch("/api/superadmin/accounts/" + id + "/options", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option_id: o.id, label: o.label, image_url: o.image_url || null, is_active: o.is_active }),
    })
    const j = await res.json()
    setMsg(res.ok ? "Saved " + o.label : "Error: " + (j.error || "unknown"))
  }

  const deleteOption = async (o: any) => {
    if (!confirm("Delete option \"" + o.label + "\"? This only removes it from this jeweler.")) return
    const res = await fetch("/api/superadmin/accounts/" + id + "/options?option_id=" + o.id, { method: "DELETE" })
    if (res.ok) { setOptions(prev => prev.filter(x => x.id !== o.id)); setMsg("Deleted " + o.label) }
    else { const j = await res.json(); setMsg("Error: " + (j.error || "unknown")) }
  }

  const addOption = async (step_key: string) => {
    const label = prompt("New option name for " + step_key + ":")
    if (!label) return
    const res = await fetch("/api/superadmin/accounts/" + id + "/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step_key, label }),
    })
    const j = await res.json()
    if (res.ok) { setOptions(prev => [...prev, j.data]); setMsg("Added " + label) }
    else setMsg("Error: " + (j.error || "unknown"))
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
        <div key={step} style={{marginBottom:24}}>
          <div style={{fontSize:11,color:INKS,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{step}</div>
          {grouped[step].map(o => (
            <div key={o.id} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
              <input value={o.label ?? ""} onChange={e=>updateLocal(o.id,{label:e.target.value})}
                style={{flex:"0 0 170px",padding:"6px 10px",fontSize:13,border:"1px solid "+BDRS,borderRadius:6}}/>
              <input value={o.image_url ?? ""} placeholder="image URL"
                onChange={e=>updateLocal(o.id,{image_url:e.target.value})}
                style={{flex:1,padding:"6px 10px",fontSize:12,border:"1px solid "+BDRS,borderRadius:6}}/>
              <label style={{fontSize:12,color:INKS,display:"flex",alignItems:"center",gap:4}}>
                <input type="checkbox" checked={!!o.is_active} onChange={e=>updateLocal(o.id,{is_active:e.target.checked})}/>
                on
              </label>
              <button onClick={()=>saveOption(o)} style={{background:G,border:"none",borderRadius:6,padding:"6px 10px",fontSize:12,color:"#fff",cursor:"pointer"}}>Save</button>
              <button onClick={()=>deleteOption(o)} style={{background:"#C0392B",border:"none",borderRadius:6,padding:"6px 10px",fontSize:12,color:"#fff",cursor:"pointer"}}>Delete</button>
            </div>
          ))}
          <button onClick={()=>addOption(step)} style={{background:"none",border:"1px dashed "+BDRS,borderRadius:6,padding:"6px 12px",fontSize:12,color:INKS,cursor:"pointer",marginTop:4}}>+ Add option to {step}</button>
        </div>
      ))}
    </div>
  )
}