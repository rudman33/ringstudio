'use client'
import { useState, useEffect } from 'react'

const G='#B5966D',GD='#8A6D48',GP='#FAF5EE',INK='#1C1612',INKS='#9C8470',INKG='#C8B8A8',W='#FFFFFF',BDR='rgba(181,150,109,0.18)',BDRS='rgba(181,150,109,0.35)'

export default function SuperAdmin(){
  const [accounts,setAccounts]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [showModal,setShowModal]=useState(false)
  const [form,setForm]=useState({email:'',business_name:'',subdomain:'',plan:'trial'})

  useEffect(()=>{load()},[])

  async function load(){
    setLoading(true)
    const res = await fetch('/api/superadmin/accounts').then(r=>r.json())
    if(res.data) setAccounts(res.data)
    setLoading(false)
  }

  async function updateStatus(id:string,status:string){
    await fetch('/api/superadmin/accounts',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})})
    setAccounts(p=>p.map((a:any)=>a.id===id?{...a,status}:a))
  }

  async function createAccount(){
    if(!form.email||!form.business_name||!form.subdomain){alert('Please fill all fields.');return}
    const res = await fetch('/api/superadmin/accounts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    const json = await res.json()
    if(json.error){alert(json.error);return}
    setShowModal(false)
    setForm({email:'',business_name:'',subdomain:'',plan:'trial'})
    load()
  }

  const btn=(col:string,txtCol?:string)=>({background:col,border:'none',borderRadius:7,padding:'7px 14px',fontSize:12,fontWeight:500,color:txtCol||'#fff',cursor:'pointer',fontFamily:'inherit'} as any)
  const inp2={width:'100%',padding:'9px 12px',fontSize:13,border:'1px solid '+BDRS,borderRadius:8,background:W,color:INK,outline:'none',fontFamily:'inherit',marginBottom:10} as any
  const statusColors:any={trial:'#FFF3CD',active:'#E1F5EE',suspended:'#FCEBEB',cancelled:'#F0F0F0'}
  const statusText:any={trial:'#856404',active:'#0F6E56',suspended:'#A32D2D',cancelled:'#666'}

  const activeCount = accounts.filter(a=>a.status==='active').length
  const trialCount = accounts.filter(a=>a.status==='trial').length
  const totalRevenue = accounts.filter(a=>a.status==='active').reduce((sum,a)=>{
    const prices:any={starter:49,pro:99,enterprise:249}
    return sum + (prices[a.plan]||0)
  },0)

  return(
    <div style={{minHeight:'100vh',background:'#F8F3EC'}}>
      <div style={{height:50,background:W,borderBottom:'1px solid '+BDR,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 1.5rem',position:'sticky',top:0,zIndex:50}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:20,color:INK}}>Ring<span style={{color:G}}>Studio</span><span style={{fontSize:12,color:INKS,fontFamily:'sans-serif',marginLeft:8}}>Super Admin</span></div>
        <button onClick={()=>window.location.href='/auth/login'} style={{background:'none',border:'1px solid '+BDR,borderRadius:7,padding:'5px 12px',fontSize:12,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>Sign out</button>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'2rem 1.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
          <div>
            <div style={{fontFamily:'Georgia,serif',fontSize:28,fontWeight:300,color:INK,marginBottom:4}}>Platform overview</div>
            <div style={{fontSize:13,color:INKS}}>{accounts.length} total jeweler accounts</div>
          </div>
          <button onClick={()=>setShowModal(true)} style={btn(G)}>+ Add jeweler</button>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:24}}>
          {[['Total accounts',accounts.length],['Active',activeCount],['On trial',trialCount],['MRR',`$${totalRevenue}`]].map(([l,v])=>(
            <div key={l as string} style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'16px'}}>
              <div style={{fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{l}</div>
              <div style={{fontFamily:'Georgia,serif',fontSize:28,fontWeight:300,color:INK}}>{v}</div>
            </div>
          ))}
        </div>

        {loading&&<div style={{fontSize:14,color:INKS}}>Loading accounts…</div>}

        {!loading&&accounts.map((acc:any)=>(
          <div key={acc.id} style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'16px 20px',marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:15,fontWeight:500,color:INK,display:'flex',alignItems:'center',gap:8}}>
                  {acc.business_name}
                  <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,background:statusColors[acc.status]||'#eee',color:statusText[acc.status]||'#666'}}>{acc.status}</span>
                </div>
                <div style={{fontSize:12,color:INKS,marginTop:2}}>{acc.email} · {acc.subdomain}.ringstudio.com · {acc.plan} plan</div>
              </div>
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                <a href={`/${acc.subdomain}`} target="_blank" style={{...btn('#F0EBE4',INK),textDecoration:'none',display:'inline-block'}}>View builder</a>
                {acc.status!=='active'&&<button onClick={()=>updateStatus(acc.id,'active')} style={btn('#0F6E56')}>Activate</button>}
                {acc.status==='active'&&<button onClick={()=>updateStatus(acc.id,'suspended')} style={btn('#C0392B')}>Suspend</button>}
              </div>
            </div>
            <div style={{fontSize:11,color:INKG,marginTop:8}}>Created {new Date(acc.created_at).toLocaleDateString()} · Trial ends {acc.trial_ends_at?new Date(acc.trial_ends_at).toLocaleDateString():'—'}</div>
          </div>
        ))}
      </div>

      {showModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:W,borderRadius:14,padding:'24px',width:380,maxWidth:'95vw'}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:300,color:INK,marginBottom:16}}>Add new jeweler</div>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Business name</label>
          <input style={inp2} value={form.business_name} onChange={e=>setForm(p=>({...p,business_name:e.target.value}))} placeholder="Tiffany & Co."/>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Email</label>
          <input style={inp2} value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="owner@tiffany.com"/>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Subdomain</label>
          <input style={inp2} value={form.subdomain} onChange={e=>setForm(p=>({...p,subdomain:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')}))} placeholder="tiffany"/>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Plan</label>
          <select style={inp2} value={form.plan} onChange={e=>setForm(p=>({...p,plan:e.target.value}))}>
            <option value="trial">Trial</option>
            <option value="starter">Starter — $49/mo</option>
            <option value="pro">Pro — $99/mo</option>
            <option value="enterprise">Enterprise — $249/mo</option>
          </select>
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
            <button onClick={()=>setShowModal(false)} style={{background:'none',border:'1px solid '+BDR,borderRadius:7,padding:'8px 16px',fontSize:13,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
            <button onClick={createAccount} style={{...btn(G),padding:'8px 16px',fontSize:13}}>Create account</button>
          </div>
        </div>
      </div>}
    </div>
  )
}