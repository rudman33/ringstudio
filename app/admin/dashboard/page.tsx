'use client'
import { useState, useEffect } from 'react'

const G='#B5966D',GD='#8A6D48',GP='#FAF5EE',INK='#1C1612',INKS='#9C8470',INKG='#C8B8A8',W='#FFFFFF',BDR='rgba(181,150,109,0.18)',BDRS='rgba(181,150,109,0.35)'
const ACCOUNT_ID='8433f769-632e-4426-b07b-0f5c9e7a2fe6'

const STEP_KEYS=['stone','shape','carat','setting','metal','band','enh']
const STEP_LABELS:any={stone:'Stone',shape:'Shape',carat:'Carat',setting:'Setting',metal:'Metal',band:'Band',enh:'Enhancements'}

export default function AdminDashboard(){
  const [page,setPage]=useState('dashboard')
  const [inquiries,setInquiries]=useState<any[]>([])
  const [options,setOptions]=useState<any>({})
  const [loading,setLoading]=useState(true)
  const [activeStep,setActiveStep]=useState('stone')
  const [showModal,setShowModal]=useState(false)
  const [editingOpt,setEditingOpt]=useState<any>(null)
  const [form,setForm]=useState({label:'',description:'',color_hex:''})

  useEffect(()=>{loadAll()},[])

  async function loadAll(){
    setLoading(true)
    const [inqRes,optRes]=await Promise.all([
      fetch('/api/admin/inquiries').then(r=>r.json()),
      fetch('/api/admin/options').then(r=>r.json())
    ])
    if(inqRes.data) setInquiries(inqRes.data)
    if(optRes.data) setOptions(optRes.data)
    setLoading(false)
  }

  async function updateStatus(id:string,status:string){
    await fetch('/api/admin/inquiries',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})})
    setInquiries(p=>p.map((i:any)=>i.id===id?{...i,status}:i))
  }

  async function saveOption(){
    if(!form.label.trim()) return
    const body={...form,account_id:ACCOUNT_ID,step_key:activeStep,sort_order:99}
    if(editingOpt){
      await fetch('/api/admin/options',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editingOpt.id,...form})})
    } else {
      await fetch('/api/admin/options',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    }
    setShowModal(false);setEditingOpt(null);setForm({label:'',description:'',color_hex:''})
    const res=await fetch('/api/admin/options').then(r=>r.json())
    if(res.data) setOptions(res.data)
  }

  async function deleteOption(id:string){
    if(!confirm('Remove this option?')) return
    await fetch('/api/admin/options',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})})
    const res=await fetch('/api/admin/options').then(r=>r.json())
    if(res.data) setOptions(res.data)
  }

  function openEdit(opt:any){setEditingOpt(opt);setForm({label:opt.label,description:opt.description||'',color_hex:opt.color_hex||''});setShowModal(true)}
  function openAdd(){setEditingOpt(null);setForm({label:'',description:'',color_hex:''});setShowModal(true)}

  const sb={width:200,flexShrink:0,background:W,borderRight:'1px solid '+BDR,display:'flex',flexDirection:'column' as const,minHeight:'calc(100vh - 50px)'}
  const sbi=(active:boolean)=>({display:'flex',alignItems:'center',gap:8,padding:'9px 16px',fontSize:13,color:active?G:INKS,cursor:'pointer',borderLeft:active?'2px solid '+G:'2px solid transparent',background:active?GP:'transparent',fontWeight:active?500:400})
  const inp2={width:'100%',padding:'9px 12px',fontSize:13,border:'1px solid '+BDRS,borderRadius:8,background:W,color:INK,outline:'none',fontFamily:'inherit',marginBottom:10} as any
  const btn=(col:string)=>({background:col,border:'none',borderRadius:7,padding:'7px 14px',fontSize:12,fontWeight:500,color:'#fff',cursor:'pointer',fontFamily:'inherit'})

  const newCount=inquiries.filter(i=>i.status==='new').length

  return(
    <div style={{minHeight:'100vh',background:'#F8F3EC'}}>
      {/* Nav */}
      <div style={{height:50,background:W,borderBottom:'1px solid '+BDR,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 1.5rem',position:'sticky',top:0,zIndex:50}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:20,color:INK}}>Ring<span style={{color:G}}>Studio</span><span style={{fontSize:12,color:INKS,fontFamily:'sans-serif',marginLeft:8}}>Admin</span></div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <a href="/demo" target="_blank" style={{fontSize:12,color:INKS,textDecoration:'none'}}>View builder ↗</a>
          <button onClick={()=>window.location.href='/auth/login'} style={{background:'none',border:'1px solid '+BDR,borderRadius:7,padding:'5px 12px',fontSize:12,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>Sign out</button>
        </div>
      </div>

      <div style={{display:'flex'}}>
        {/* Sidebar */}
        <div style={sb}>
          <div style={{padding:'16px',borderBottom:'1px solid '+BDR}}>
            <div style={{fontSize:13,fontWeight:500,color:INK}}>Ring Studio Demo</div>
            <div style={{fontSize:11,color:INKS,marginTop:2}}>demo.ringstudio.com</div>
          </div>
          {[
            {id:'dashboard',label:'Dashboard',icon:'📊'},
            {id:'inquiries',label:'Inquiries'+(newCount?' ('+newCount+')':''),icon:'📬'},
            {id:'options',label:'Ring options',icon:'💎'},
            {id:'settings',label:'Settings',icon:'⚙️'},
          ].map(item=>(
            <div key={item.id} style={sbi(page===item.id)} onClick={()=>setPage(item.id)}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{flex:1,padding:'2rem',overflowY:'auto' as const}}>
          {loading&&<div style={{fontSize:14,color:INKS}}>Loading…</div>}

          {/* Dashboard */}
          {!loading&&page==='dashboard'&&<div>
            <div style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:300,color:INK,marginBottom:4}}>Dashboard</div>
            <div style={{fontSize:13,color:INKS,marginBottom:20}}>Overview of your ring builder activity.</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:24}}>
              {[['Total inquiries',inquiries.length],['New',newCount],['Quoted',inquiries.filter(i=>i.status==='quoted').length],['Closed',inquiries.filter(i=>i.status==='closed').length]].map(([l,v])=>(
                <div key={l} style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'16px'}}>
                  <div style={{fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{l}</div>
                  <div style={{fontFamily:'Georgia,serif',fontSize:32,fontWeight:300,color:INK}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontFamily:'Georgia,serif',fontSize:18,fontWeight:300,color:INK,marginBottom:12}}>Recent inquiries</div>
            {inquiries.slice(0,5).map((inq:any)=>inqRow(inq,updateStatus))}
          </div>}

          {/* Inquiries */}
          {!loading&&page==='inquiries'&&<div>
            <div style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:300,color:INK,marginBottom:4}}>Inquiries</div>
            <div style={{fontSize:13,color:INKS,marginBottom:20}}>{inquiries.length} total</div>
            {inquiries.length===0&&<div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'3rem',textAlign:'center',fontSize:14,color:INKS}}>No inquiries yet.</div>}
            {inquiries.map((inq:any)=>inqRow(inq,updateStatus))}
          </div>}

          {/* Options */}
          {!loading&&page==='options'&&<div>
            <div style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:300,color:INK,marginBottom:4}}>Ring options</div>
            <div style={{fontSize:13,color:INKS,marginBottom:20}}>Manage choices shown to customers in your ring builder.</div>
            <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap' as const}}>
              {STEP_KEYS.map(k=>(
                <button key={k} onClick={()=>setActiveStep(k)} style={{...btn(activeStep===k?G:'#E8E0D8'),color:activeStep===k?'#fff':INK}}>{STEP_LABELS[k]}</button>
              ))}
            </div>
            <div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'16px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:500,color:INK}}>{STEP_LABELS[activeStep]} options <span style={{color:INKS,fontWeight:400}}>({(options[activeStep]||[]).length})</span></div>
                <button onClick={openAdd} style={{...btn(G)}}>+ Add option</button>
              </div>
              {(options[activeStep]||[]).map((opt:any)=>(
                <div key={opt.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid '+BDR}}>
                  {opt.color_hex&&<div style={{width:20,height:20,borderRadius:'50%',background:opt.color_hex,border:'1px solid '+BDR,flexShrink:0}}/>}
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:INK}}>{opt.label}</div>
                    {opt.description&&<div style={{fontSize:11,color:INKS}}>{opt.description}</div>}
                  </div>
                  <button onClick={()=>openEdit(opt)} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:INKS}}>Edit</button>
                  <button onClick={()=>deleteOption(opt.id)} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#C0392B'}}>Delete</button>
                </div>
              ))}
              {(options[activeStep]||[]).length===0&&<div style={{fontSize:13,color:INKS,padding:'1rem 0',textAlign:'center'}}>No options yet. Add some above.</div>}
            </div>
          </div>}

          {/* Settings */}
          {!loading&&page==='settings'&&<div>
            <div style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:300,color:INK,marginBottom:4}}>Settings</div>
            <div style={{fontSize:13,color:INKS,marginBottom:20}}>Your ring builder configuration.</div>
            <div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'20px'}}>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Business name</label>
                <input style={inp2} defaultValue="Ring Studio Demo" placeholder="Your business name"/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Notification email</label>
                <input style={inp2} defaultValue="rudman33@hotmail.com" placeholder="Where to send inquiry alerts"/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Brand color</label>
                <input type="color" defaultValue="#B5966D" style={{height:38,width:100,padding:'2px 6px',border:'1px solid '+BDRS,borderRadius:8}}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Your builder URL</label>
                <div style={{padding:'9px 12px',background:GP,border:'1px solid '+BDR,borderRadius:8,fontSize:13,color:GD}}>ringstudio-git-main-rudman33s-projects.vercel.app/demo</div>
              </div>
              <button style={{...btn(G),padding:'10px 20px',fontSize:13}} onClick={()=>alert('Settings saved!')}>Save settings</button>
            </div>
          </div>}
        </div>
      </div>

      {/* Modal */}
      {showModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:W,borderRadius:14,padding:'24px',width:360,maxWidth:'95vw'}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:20,fontWeight:300,color:INK,marginBottom:16}}>{editingOpt?'Edit option':'Add option'} — {STEP_LABELS[activeStep]}</div>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Name</label>
          <input style={inp2} value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} placeholder="e.g. Alexandrite"/>
          <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Description</label>
          <input style={inp2} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="e.g. Colour-changing gem"/>
          {(activeStep==='metal'||activeStep==='stone')&&<>
            <label style={{display:'block',fontSize:11,color:INKS,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Colour swatch</label>
            <input type="color" value={form.color_hex||'#B5966D'} onChange={e=>setForm(p=>({...p,color_hex:e.target.value}))} style={{height:38,width:'100%',padding:'2px 6px',border:'1px solid '+BDRS,borderRadius:8,marginBottom:10}}/>
          </>}
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
            <button onClick={()=>{setShowModal(false);setEditingOpt(null)}} style={{background:'none',border:'1px solid '+BDR,borderRadius:7,padding:'8px 16px',fontSize:13,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
            <button onClick={saveOption} style={{...btn(G),padding:'8px 16px',fontSize:13}}>Save</button>
          </div>
        </div>
      </div>}
    </div>
  )
}

function inqRow(inq:any,updateStatus:any){
  const [open,setOpen]=useState(false)
  const statusColors:any={new:'#EEEDFE',read:'#F0F0F0',quoted:'#E1F5EE',closed:'#F0F0F0',spam:'#FCEBEB'}
  const statusText:any={new:'#534AB7',read:'#666',quoted:'#0F6E56',closed:'#666',spam:'#A32D2D'}
  const G='#B5966D',INK='#1C1612',INKS='#9C8470',W='#FFFFFF',BDR='rgba(181,150,109,0.18)'
  return(
    <div key={inq.id} style={{background:W,border:'1px solid '+BDR,borderRadius:12,marginBottom:10,overflow:'hidden'}}>
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
        <div style={{color:INKS,fontSize:14}}>{open?'▲':'▼'}</div>
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
          <select value={inq.status} onChange={e=>updateStatus(inq.id,e.target.value)} style={{fontSize:12,padding:'4px 8px',borderRadius:20,border:'1px solid '+BDR,background:W,cursor:'pointer'}}>
            {['new','read','quoted','closed','spam'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>}
    </div>
  )
}
