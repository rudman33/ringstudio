'use client'
import { useState, useEffect, useRef } from 'react'

const G='#B5966D',GD='#8A6D48',GP='#FAF5EE',INK='#1C1612',INKS='#9C8470',INKG='#C8B8A8',W='#FFFFFF',BDR='rgba(181,150,109,0.18)',BDRS='rgba(181,150,109,0.35)'
const DOMAIN=process.env.NEXT_PUBLIC_APP_DOMAIN||'jeweleryengine.com'
const STEP_KEYS=['stone','shape','carat','setting','metal','band','enh']
const STEP_LABELS:any={stone:'Stone',shape:'Shape',carat:'Carat',setting:'Setting',metal:'Metal',band:'Band',enh:'Enhancements'}

function InqRow({inq,onUpdate}:{inq:any,onUpdate:(id:string,status:string)=>void}){
  const [open,setOpen]=useState(false)
  const statusColors:any={new:'#EEEDFE',read:'#F0F0F0',quoted:'#E1F5EE',closed:'#F0F0F0',spam:'#FCEBEB'}
  const statusText:any={new:'#534AB7',read:'#666',quoted:'#0F6E56',closed:'#666',spam:'#A32D2D'}
  return(
    <div style={{background:W,border:'1px solid '+BDR,borderRadius:12,marginBottom:10,overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',cursor:'pointer'}} onClick={()=>setOpen(o=>!o)}>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:500,color:INK,display:'flex',alignItems:'center',gap:8}}>
            {inq.customer_name}
            <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,background:statusColors[inq.status]||'#eee',color:statusText[inq.status]||'#666'}}>{inq.status}</span>
          </div>
          <div style={{fontSize:12,color:INKS,marginTop:2}}>{inq.customer_email}</div>
        </div>
        <div style={{textAlign:'right',flexShrink:0}}>
          <div style={{fontSize:11,color:G,fontWeight:500}}>{inq.reference_code}</div>
          <div style={{fontSize:11,color:INKS}}>{inq.created_at?.slice(0,10)}</div>
        </div>
        <div style={{color:INKS,fontSize:12}}>{open?'▲':'▼'}</div>
      </div>
      {open&&<div style={{padding:'14px 16px',borderTop:'1px solid '+BDR,background:'#FAFAF9'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',marginBottom:12}}>
          {[['Ring type',inq.ring_type],['Stone',inq.selections?.stone],['Shape',inq.selections?.shape],['Carat',inq.selections?.carat],['Setting',inq.selections?.setting],['Metal',inq.selections?.metal],['Band',inq.selections?.band],['Budget',inq.budget_range],['Timeline',inq.timeline],['Ring size',inq.ring_size],['Phone',inq.customer_phone]].map(([k,v])=>v?(
            <div key={k} style={{fontSize:12,display:'flex',gap:6}}><span style={{color:INKS}}>{k}:</span><span style={{fontWeight:500,color:INK}}>{v}</span></div>
          ):null)}
        </div>
        {inq.notes&&<div style={{fontSize:12,color:INKS,marginBottom:12,padding:'8px 12px',background:W,borderRadius:8,border:'1px solid '+BDR}}>{inq.notes}</div>}
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <label style={{fontSize:12,color:INKS}}>Status:</label>
          <select value={inq.status} onChange={e=>onUpdate(inq.id,e.target.value)} style={{fontSize:12,padding:'4px 8px',borderRadius:20,border:'1px solid '+BDR,background:W,cursor:'pointer'}}>
            {['new','read','quoted','closed','spam'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>}
    </div>
  )
}

export default function AdminDashboard(){
  const [page,setPage]=useState('dashboard')
  const [inquiries,setInquiries]=useState<any[]>([])
  const [options,setOptions]=useState<any>({})
  const [loading,setLoading]=useState(true)
  const [activeStep,setActiveStep]=useState('stone')
  const [showModal,setShowModal]=useState(false)
  const [editingOpt,setEditingOpt]=useState<any>(null)
  const [form,setForm]=useState({label:'',description:'',color_hex:'',image_url:''})
  const [calendlyUrl,setCalendlyUrl]=useState('')
  const [account,setAccount]=useState<any>(null)
  const [embedCopied,setEmbedCopied]=useState(false)
  const [notifEmail,setNotifEmail]=useState('')
  const [brandColor,setBrandColor]=useState('#B5966D')
  const [ghlApiKey,setGhlApiKey]=useState('')
  const [ghlLocationId,setGhlLocationId]=useState('')
  const [textColor,setTextColor]=useState('#1C1612')
  const [buttonColor,setButtonColor]=useState('#B5966D')
  const [uploading,setUploading]=useState(false)
  const fileRef=useRef<HTMLInputElement>(null)

  useEffect(()=>{loadAll()},[])

  async function loadAll(){
    setLoading(true)
    const [inqRes,optRes]=await Promise.all([
      fetch('/api/admin/inquiries').then(r=>r.json()),
      fetch('/api/admin/options').then(r=>r.json())
    ])
    if(inqRes.data) setInquiries(inqRes.data)
    if(optRes.data) setOptions(optRes.data)
    const accRes = await fetch('/api/admin/account').then(r=>r.json())
    if(accRes.data) setAccount(accRes.data)
    if(accRes.data?.calendly_url) setCalendlyUrl(accRes.data.calendly_url)
    if(accRes.data?.ghl_api_key) setGhlApiKey(accRes.data.ghl_api_key)
    if(accRes.data?.ghl_location_id) setGhlLocationId(accRes.data.ghl_location_id)
    if(accRes.data?.text_color) setTextColor(accRes.data.text_color)
    if(accRes.data?.button_color) setButtonColor(accRes.data.button_color)
    if(accRes.data?.notification_email) setNotifEmail(accRes.data.notification_email)
    if(accRes.data?.brand_color) setBrandColor(accRes.data.brand_color)
    setLoading(false)
  }

  async function updateStatus(id:string,status:string){
    await fetch('/api/admin/inquiries',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})})
    setInquiries(p=>p.map((i:any)=>i.id===id?{...i,status}:i))
  }

  async function uploadImage(file:File){
    setUploading(true)
    const fd=new FormData()
    fd.append('file',file)
    fd.append('path',`options/${account?.id}/${activeStep}/${Date.now()}-${file.name}`)
    const res=await fetch('/api/admin/upload',{method:'POST',body:fd}).then(r=>r.json())
    if(res.url) setForm(p=>({...p,image_url:res.url}))
    setUploading(false)
  }

  async function saveOption(){
    if(!form.label.trim()) return
    if(editingOpt){
      await fetch('/api/admin/options',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editingOpt.id,...form})})
    } else {
      await fetch('/api/admin/options',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,account_id:account?.id,step_key:activeStep,sort_order:99})})
    }
    setShowModal(false);setEditingOpt(null);setForm({label:'',description:'',color_hex:'',image_url:''})
    const res=await fetch('/api/admin/options').then(r=>r.json())
    if(res.data) setOptions(res.data)
  }

  async function deleteOption(id:string){
    if(!confirm('Remove this option?')) return
    await fetch('/api/admin/options',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})})
    const res=await fetch('/api/admin/options').then(r=>r.json())
    if(res.data) setOptions(res.data)
  }

  function openEdit(opt:any){setEditingOpt(opt);setForm({label:opt.label,description:opt.description||'',color_hex:opt.color_hex||'',image_url:opt.image_url||''});setShowModal(true)}
  function openAdd(){setEditingOpt(null);setForm({label:'',description:'',color_hex:'',image_url:''});setShowModal(true)}

  const [billingLoading,setBillingLoading]=useState('')

  async function startCheckout(plan:string){
    setBillingLoading(plan)
    try{
      const res=await fetch('/api/admin/billing/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})})
      const json=await res.json()
      if(!res.ok||!json.data?.url){
        alert('Could not start checkout: '+(json.error||'Unknown error. Please try again.'))
        setBillingLoading('')
        return
      }
      window.location.href=json.data.url
    }catch(e){
      alert('Could not start checkout: network error. Please try again.')
      setBillingLoading('')
    }
  }

  async function buyDesignPack(){
    setBillingLoading('designs')
    try{
      const res=await fetch('/api/admin/billing/buy-designs',{method:'POST'})
      const json=await res.json()
      if(!res.ok||!json.data?.url){
        alert('Could not start purchase: '+(json.error||'Unknown error.'))
        setBillingLoading('')
        return
      }
      window.location.href=json.data.url
    }catch(e){
      alert('Could not start purchase: network error. Please try again.')
      setBillingLoading('')
    }
  }

  async function openBillingPortal(){
    setBillingLoading('portal')
    try{
      const res=await fetch('/api/admin/billing/portal',{method:'POST'})
      const json=await res.json()
      if(!res.ok||!json.data?.url){
        alert('Could not open billing portal: '+(json.error||'Unknown error.'))
        setBillingLoading('')
        return
      }
      window.location.href=json.data.url
    }catch(e){
      alert('Could not open billing portal: network error. Please try again.')
      setBillingLoading('')
    }
  }

  async function saveCalendly(){
    try{
      const res=await fetch('/api/admin/account',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({calendly_url:calendlyUrl,notification_email:notifEmail,brand_color:brandColor,ghl_api_key:ghlApiKey,ghl_location_id:ghlLocationId,text_color:textColor,button_color:buttonColor})})
      const json=await res.json()
      if(!res.ok){
        alert('Could not save: '+(json.error||'Unknown error. Please try again.'))
        return
      }
      // Re-fetch from the server to confirm what's actually saved, rather than trusting local state
      const confirmRes=await fetch('/api/admin/account').then(r=>r.json())
      const mismatch=confirmRes.data?.calendly_url!==calendlyUrl||confirmRes.data?.notification_email!==notifEmail||confirmRes.data?.brand_color!==brandColor||confirmRes.data?.ghl_api_key!==ghlApiKey||confirmRes.data?.ghl_location_id!==ghlLocationId||confirmRes.data?.text_color!==textColor||confirmRes.data?.button_color!==buttonColor
      if(mismatch){
        alert('Warning: the saved values don\'t fully match what you entered. Please check and try again.')
        if(confirmRes.data){
          if(confirmRes.data.calendly_url) setCalendlyUrl(confirmRes.data.calendly_url)
          if(confirmRes.data.notification_email) setNotifEmail(confirmRes.data.notification_email)
          if(confirmRes.data.brand_color) setBrandColor(confirmRes.data.brand_color)
          if(confirmRes.data.ghl_api_key) setGhlApiKey(confirmRes.data.ghl_api_key)
          if(confirmRes.data.ghl_location_id) setGhlLocationId(confirmRes.data.ghl_location_id)
          if(confirmRes.data.text_color) setTextColor(confirmRes.data.text_color)
          if(confirmRes.data.button_color) setButtonColor(confirmRes.data.button_color)
        }
        return
      }
      alert('Settings saved!')
    }catch(e){
      alert('Could not save: network error. Please check your connection and try again.')
    }
  }

  const btn=(col:string,txtCol?:string)=>({background:col,border:'none',borderRadius:7,padding:'7px 14px',fontSize:12,fontWeight:500,color:txtCol||'#fff',cursor:'pointer',fontFamily:'inherit'} as any)
  const inp2={width:'100%',padding:'9px 12px',fontSize:13,border:'1px solid '+BDRS,borderRadius:8,background:W,color:INK,outline:'none',fontFamily:'inherit',marginBottom:10} as any
  const newCount=inquiries.filter(i=>i.status==='new').length

  return(
    <div style={{minHeight:'100vh',background:'#F8F3EC'}}>
      <div style={{height:50,background:W,borderBottom:'1px solid '+BDR,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 1.5rem',position:'sticky',top:0,zIndex:50}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:20,color:INK}}>Jewelry<span style={{color:G}}>Engine</span><span style={{fontSize:12,color:INKS,fontFamily:'sans-serif',marginLeft:8}}>Admin</span></div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <a href={account?.subdomain?`/${account.subdomain}`:'/demo'} target="_blank" style={{fontSize:12,color:INKS,textDecoration:'none'}}>View builder ↗</a>
          <button onClick={()=>window.location.href='/auth/login'} style={{background:'none',border:'1px solid '+BDR,borderRadius:7,padding:'5px 12px',fontSize:12,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>Sign out</button>
        </div>
      </div>
      <div style={{display:'flex'}}>
        <div style={{width:200,flexShrink:0,background:W,borderRight:'1px solid '+BDR,minHeight:'calc(100vh - 50px)'}}>
          <div style={{padding:'16px',borderBottom:'1px solid '+BDR}}>
            <div style={{fontSize:13,fontWeight:500,color:INK}}>{account?.business_name||'Loading…'}</div>
            <div style={{fontSize:11,color:INKS,marginTop:2}}>{account?.subdomain?`${account.subdomain}.${DOMAIN}`:''}</div>
          </div>
          {[{id:'dashboard',label:'Dashboard',icon:'📊'},{id:'inquiries',label:'Inquiries'+(newCount?' ('+newCount+')':''),icon:'📬'},{id:'options',label:'Ring options',icon:'💎'},{id:'settings',label:'Settings',icon:'⚙️'}].map(item=>(
            <div key={item.id} onClick={()=>setPage(item.id)} style={{display:'flex',alignItems:'center',gap:8,padding:'9px 16px',fontSize:13,color:page===item.id?G:INKS,cursor:'pointer',borderLeft:page===item.id?'2px solid '+G:'2px solid transparent',background:page===item.id?GP:'transparent',fontWeight:page===item.id?500:400}}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </div>
        <div style={{flex:1,padding:'2rem',overflowY:'auto' as const}}>
          {loading&&<div style={{fontSize:14,color:INKS}}>Loading…</div>}
          {!loading&&page==='dashboard'&&<div>
            <div style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:300,color:INK,marginBottom:4}}>Dashboard</div>
            <div style={{fontSize:13,color:INKS,marginBottom:20}}>Overview of your ring builder.</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:24}}>
              {[['Total',inquiries.length],['New',newCount],['Quoted',inquiries.filter(i=>i.status==='quoted').length],['Closed',inquiries.filter(i=>i.status==='closed').length]].map(([l,v])=>(
                <div key={l as string} style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'16px'}}>
                  <div style={{fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{l}</div>
                  <div style={{fontFamily:'Georgia,serif',fontSize:32,fontWeight:300,color:INK}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontFamily:'Georgia,serif',fontSize:18,fontWeight:300,color:INK,marginBottom:12}}>Recent inquiries</div>
            {inquiries.slice(0,5).map((inq:any)=><InqRow key={inq.id} inq={inq} onUpdate={updateStatus}/>)}
          </div>}
          {!loading&&page==='inquiries'&&<div>
            <div style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:300,color:INK,marginBottom:4}}>Inquiries</div>
            <div style={{fontSize:13,color:INKS,marginBottom:20}}>{inquiries.length} total</div>
            {inquiries.length===0&&<div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'3rem',textAlign:'center',fontSize:14,color:INKS}}>No inquiries yet.</div>}
            {inquiries.map((inq:any)=><InqRow key={inq.id} inq={inq} onUpdate={updateStatus}/>)}
          </div>}
          {!loading&&page==='options'&&<div>
            <div style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:300,color:INK,marginBottom:4}}>Ring options</div>
            <div style={{fontSize:13,color:INKS,marginBottom:20}}>Upload photos for each option to customise your builder.</div>
            <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap' as const}}>
              {STEP_KEYS.map(k=><button key={k} onClick={()=>setActiveStep(k)} style={btn(activeStep===k?G:'#E8E0D8',activeStep===k?'#fff':INK)}>{STEP_LABELS[k]}</button>)}
            </div>
            <div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'16px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:500,color:INK}}>{STEP_LABELS[activeStep]} <span style={{color:INKS,fontWeight:400}}>({(options[activeStep]||[]).length})</span></div>
                <button onClick={openAdd} style={btn(G)}>+ Add option</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
                {(options[activeStep]||[]).map((opt:any)=>(
                  <div key={opt.id} style={{border:'1px solid '+BDR,borderRadius:10,overflow:'hidden',background:'#FAFAF9'}}>
                    <div style={{width:'100%',aspectRatio:'1',background:GP,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                      {opt.image_url
                        ?<img src={opt.image_url} alt={opt.label} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        :<div style={{textAlign:'center'}}>
                          {opt.color_hex&&<div style={{width:40,height:40,borderRadius:'50%',background:opt.color_hex,margin:'0 auto 8px',border:'1px solid '+BDR}}/>}
                          <div style={{fontSize:11,color:INKG}}>No image</div>
                        </div>
                      }
                    </div>
                    <div style={{padding:'8px 10px'}}>
                      <div style={{fontSize:12,fontWeight:500,color:INK,marginBottom:2}}>{opt.label}</div>
                      {opt.description&&<div style={{fontSize:11,color:INKS,marginBottom:6}}>{opt.description}</div>}
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>openEdit(opt)} style={{flex:1,...btn('#F0EBE4',INK),fontSize:11,padding:'4px 0'}}>Edit</button>
                        <button onClick={()=>deleteOption(opt.id)} style={{...btn('#FCEBEB','#C0392B'),fontSize:11,padding:'4px 8px'}}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {(options[activeStep]||[]).length===0&&<div style={{fontSize:13,color:INKS,padding:'1rem 0',textAlign:'center'}}>No options yet.</div>}
            </div>
          </div>}
          {!loading&&page==='settings'&&<div>
            <div style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:300,color:INK,marginBottom:4}}>Settings</div>
            <div style={{fontSize:13,color:INKS,marginBottom:20}}>Your ring builder configuration.</div>
            <div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'20px'}}>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Business name</label>
                <input style={inp2} value={account?.business_name||''} readOnly/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Notification email</label>
                <input style={inp2} value={notifEmail} onChange={e=>setNotifEmail(e.target.value)} placeholder="you@example.com"/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Brand color</label>
                <input type="color" value={brandColor} onChange={e=>setBrandColor(e.target.value)} style={{height:38,width:100,padding:'2px 6px',border:'1px solid '+BDRS,borderRadius:8}}/>
              </div>

              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Text color</label>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} style={{height:38,width:60,padding:'2px 6px',border:'1px solid '+BDRS,borderRadius:8}}/>
                  <span style={{fontSize:12,color:INKS}}>{textColor}</span>
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Button color</label>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <input type="color" value={buttonColor} onChange={e=>setButtonColor(e.target.value)} style={{height:38,width:60,padding:'2px 6px',border:'1px solid '+BDRS,borderRadius:8}}/>
                  <span style={{fontSize:12,color:INKS}}>{buttonColor}</span>
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Calendly booking link</label>
                <input style={inp2} value={calendlyUrl} onChange={e=>setCalendlyUrl(e.target.value)} placeholder="https://calendly.com/your-name/consultation"/>
                <div style={{fontSize:11,color:INKS,marginTop:-4,marginBottom:14}}>Customers will see a "Book a consultation" button after submitting an inquiry.</div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>GoHighLevel integration (optional)</label>
                <input style={inp2} value={ghlApiKey} onChange={e=>setGhlApiKey(e.target.value)} placeholder="Private Integration Token"/>
                <input style={{...inp2,marginBottom:4}} value={ghlLocationId} onChange={e=>setGhlLocationId(e.target.value)} placeholder="Location ID"/>
                <div style={{fontSize:11,color:INKS,marginTop:0,marginBottom:14}}>Connect your GoHighLevel account to automatically push every new inquiry as a contact. Find both in your GHL account under Settings &gt; Private Integrations.</div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Your builder URL</label>
                <div style={{padding:'9px 12px',background:GP,border:'1px solid '+BDR,borderRadius:8,fontSize:13,color:GD}}>{account?.subdomain?`${DOMAIN}/${account.subdomain}`:'Loading…'}</div>
              </div>
              <button style={{...btn(G),padding:'10px 20px',fontSize:13}} onClick={saveCalendly}>Save settings</button>
            </div>

            <div style={{fontFamily:'Georgia,serif',fontSize:18,fontWeight:300,color:INK,margin:'24px 0 4px'}}>Embed on your website</div>
            <div style={{fontSize:13,color:INKS,marginBottom:14}}>Copy this snippet into any page on your site — WordPress, HighLevel, or plain HTML. The box automatically resizes itself as customers move through the builder.</div>
            <div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'20px'}}>
              {account?.subdomain
                ?(()=>{
                  const embedCode=`<div id="jewelry-engine-embed"></div>
<script>
(function(){
  var subdomain = "${account.subdomain}";
  var baseUrl = "https://${DOMAIN}";
  var container = document.getElementById("jewelry-engine-embed");
  var iframe = document.createElement("iframe");
  iframe.src = baseUrl + "/" + subdomain;
  iframe.style.width = "100%";
  iframe.style.border = "none";
  iframe.style.minHeight = "600px";
  iframe.style.display = "block";
  container.appendChild(iframe);
  window.addEventListener("message", function(e){
    if(e.data && e.data.type === "ringstudio:resize" && e.data.subdomain === subdomain){
      iframe.style.height = e.data.height + "px";
    }
  });
})();
</script>`
                  return(
                    <>
                      <pre style={{background:GP,border:'1px solid '+BDR,borderRadius:8,padding:'14px',fontSize:11,fontFamily:'ui-monospace,SF Mono,Menlo,monospace',color:INK,overflowX:'auto' as const,whiteSpace:'pre' as const,marginBottom:12}}>{embedCode}</pre>
                      <button onClick={()=>{navigator.clipboard.writeText(embedCode);setEmbedCopied(true);setTimeout(()=>setEmbedCopied(false),2000)}} style={{...btn(embedCopied?'#0F6E56':G),padding:'9px 18px',fontSize:13}}>{embedCopied?'✓ Copied!':'Copy embed code'}</button>
                    </>
                  )
                })()
                :<div style={{fontSize:13,color:INKS}}>Loading…</div>
              }
            </div>

            <div style={{fontFamily:'Georgia,serif',fontSize:18,fontWeight:300,color:INK,margin:'24px 0 4px'}}>Billing</div>
            <div style={{fontSize:13,color:INKS,marginBottom:14}}>
              Current plan: <span style={{fontWeight:500,color:INK,textTransform:'capitalize'}}>{account?.plan||'—'}</span>
              {' · '}Status: <span style={{fontWeight:500,color:INK,textTransform:'capitalize'}}>{account?.status||'—'}</span>
              {account?.trial_ends_at&&account?.status==='trial'&&<> · Trial ends {new Date(account.trial_ends_at).toLocaleDateString()}</>}
            </div>

            <div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'16px 20px',marginBottom:16}}>
              {(()=>{
                const limits:any={starter:100,pro:500,enterprise:Infinity,trial:100,free:100}
                const limit=limits[account?.plan]??100
                const used=account?.designs_used_this_period||0
                const extra=account?.extra_designs_purchased||0
                const allowance=limit===Infinity?Infinity:limit+extra
                const pct=allowance===Infinity?0:Math.min(100,Math.round((used/allowance)*100))
                return(
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:8}}>
                      <span style={{color:INKS}}>AI designs this period</span>
                      <span style={{fontWeight:500,color:INK}}>{used} / {allowance===Infinity?'Unlimited':allowance}</span>
                    </div>
                    {allowance!==Infinity&&
                      <div style={{height:6,borderRadius:4,background:'#F0EBE4',overflow:'hidden',marginBottom:12}}>
                        <div style={{height:'100%',width:`${pct}%`,background:pct>=100?'#C0392B':G,transition:'width .3s ease'}}/>
                      </div>
                    }
                    {allowance!==Infinity&&pct>=80&&
                      <button onClick={buyDesignPack} disabled={!!billingLoading} style={{...btn('#F0EBE4',INK),padding:'8px 16px',fontSize:12,opacity:billingLoading?.6:1}}>
                        {billingLoading==='designs'?'Loading…':'+ Buy 50 more designs — $25'}
                      </button>
                    }
                  </div>
                )
              })()}
            </div>

            <div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'20px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:16}}>
                  <div style={{border:account?.plan==='starter'?'2px solid '+G:'1px solid '+BDR,background:account?.plan==='starter'?GP:W,borderRadius:10,padding:'14px 10px',textAlign:'center'}}>
                    <div style={{fontSize:13,fontWeight:500,color:INK}}>Starter</div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:20,color:G,margin:'4px 0'}}>$49<span style={{fontSize:11,color:INKS}}>/mo</span></div>
                    {account?.plan==='starter'
                      ?<div style={{fontSize:11,color:'#0F6E56',fontWeight:500,padding:'8px 0'}}>Current plan</div>
                      :<button onClick={()=>startCheckout('starter')} disabled={!!billingLoading} style={{...btn(G),width:'100%',padding:'7px 0',fontSize:12,opacity:billingLoading?.6:1}}>{billingLoading==='starter'?'Loading…':'Choose'}</button>
                    }
                  </div>
                  <div style={{border:account?.plan==='pro'?'2px solid '+G:'1px solid '+BDR,background:account?.plan==='pro'?GP:W,borderRadius:10,padding:'14px 10px',textAlign:'center'}}>
                    <div style={{fontSize:13,fontWeight:500,color:INK}}>Pro</div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:20,color:G,margin:'4px 0'}}>$99<span style={{fontSize:11,color:INKS}}>/mo</span></div>
                    {account?.plan==='pro'
                      ?<div style={{fontSize:11,color:'#0F6E56',fontWeight:500,padding:'8px 0'}}>Current plan</div>
                      :<button onClick={()=>startCheckout('pro')} disabled={!!billingLoading} style={{...btn(G),width:'100%',padding:'7px 0',fontSize:12,opacity:billingLoading?.6:1}}>{billingLoading==='pro'?'Loading…':'Choose'}</button>
                    }
                  </div>
                  <div style={{border:account?.plan==='enterprise'?'2px solid '+G:'1px solid '+BDR,background:account?.plan==='enterprise'?GP:W,borderRadius:10,padding:'14px 10px',textAlign:'center'}}>
                    <div style={{fontSize:13,fontWeight:500,color:INK}}>Enterprise</div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:20,color:G,margin:'4px 0'}}>$249<span style={{fontSize:11,color:INKS}}>/mo</span></div>
                    {account?.plan==='enterprise'
                      ?<div style={{fontSize:11,color:'#0F6E56',fontWeight:500,padding:'8px 0'}}>Current plan</div>
                      :<button onClick={()=>startCheckout('enterprise')} disabled={!!billingLoading} style={{...btn(G),width:'100%',padding:'7px 0',fontSize:12,opacity:billingLoading?.6:1}}>{billingLoading==='enterprise'?'Loading…':'Choose'}</button>
                    }
                  </div>
              </div>
              {account?.stripe_customer_id&&
                <button onClick={openBillingPortal} disabled={!!billingLoading} style={{...btn('#F0EBE4',INK),padding:'9px 18px',fontSize:13,opacity:billingLoading?.6:1}}>
                  {billingLoading==='portal'?'Loading…':'Manage billing →'}
                </button>
              }
              {!account?.stripe_customer_id&&
                <div style={{fontSize:12,color:INKS}}>Choose a plan above to add billing details.</div>
              }
            </div>
          </div>}
        </div>
      </div>
      {showModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:W,borderRadius:14,padding:'24px',width:380,maxWidth:'95vw',maxHeight:'90vh',overflowY:'auto' as const}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:300,color:INK,marginBottom:16}}>{editingOpt?'Edit':'Add'} {STEP_LABELS[activeStep]} option</div>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Name</label>
          <input style={inp2} value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} placeholder="e.g. Alexandrite"/>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Description</label>
          <input style={inp2} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="e.g. Colour-changing gem"/>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Photo</label>
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&uploadImage(e.target.files[0])}/>
          {form.image_url
            ?<div style={{position:'relative',marginBottom:10}}>
              <img src={form.image_url} alt="preview" style={{width:'100%',height:160,objectFit:'cover',borderRadius:8,border:'1px solid '+BDR}}/>
              <button onClick={()=>setForm(p=>({...p,image_url:''}))} style={{position:'absolute',top:6,right:6,background:'rgba(0,0,0,.5)',border:'none',borderRadius:'50%',width:24,height:24,color:'#fff',cursor:'pointer',fontSize:12}}>✕</button>
            </div>
            :<div onClick={()=>fileRef.current?.click()} style={{border:'1px dashed '+BDRS,borderRadius:8,padding:'1.5rem',textAlign:'center',cursor:'pointer',marginBottom:10,background:uploading?GP:'transparent'}}>
              <div style={{fontSize:24,marginBottom:6}}>📷</div>
              <div style={{fontSize:13,color:INKS}}>{uploading?'Uploading…':'Click to upload a photo'}</div>
              <div style={{fontSize:11,color:INKG,marginTop:3}}>JPG, PNG or WEBP</div>
            </div>
          }
          {(activeStep==='metal'||activeStep==='stone')&&<>
            <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Colour swatch (fallback)</label>
            <input type="color" value={form.color_hex||'#B5966D'} onChange={e=>setForm(p=>({...p,color_hex:e.target.value}))} style={{height:38,width:'100%',padding:'2px 6px',border:'1px solid '+BDRS,borderRadius:8,marginBottom:10}}/>
          </>}
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
            <button onClick={()=>{setShowModal(false);setEditingOpt(null)}} style={{background:'none',border:'1px solid '+BDR,borderRadius:7,padding:'8px 16px',fontSize:13,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
            <button onClick={saveOption} disabled={uploading} style={{...btn(G),padding:'8px 16px',fontSize:13,opacity:uploading?.6:1}}>Save</button>
          </div>
        </div>
      </div>}
    </div>
  )
}
