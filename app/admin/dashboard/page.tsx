'use client'
import { useEffect, useState } from 'react'

const G='#B5966D',INK='#1C1612',INKS='#9C8470',W='#FFFFFF',BDR='rgba(181,150,109,0.18)'

export default function Dashboard() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('/api/admin/inquiries')
      .then(r=>r.json())
      .then(json=>{ if(json.data) setInquiries(json.data) })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  },[])

  return (
    <div style={{minHeight:'100vh',background:'#F8F3EC'}}>
      <div style={{padding:'0 1.5rem',height:50,background:W,borderBottom:'1px solid '+BDR,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:20,color:INK}}>Ring<span style={{color:G}}>Studio</span></div>
        <button onClick={()=>window.location.href='/auth/login'} style={{background:'none',border:'1px solid '+BDR,borderRadius:7,padding:'5px 12px',fontSize:12,color:INKS,cursor:'pointer',fontFamily:'inherit'}}>Sign out</button>
      </div>
      <div style={{maxWidth:800,margin:'0 auto',padding:'2rem 1rem'}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:28,fontWeight:300,color:INK,marginBottom:4}}>Your inquiries</div>
        <div style={{fontSize:13,color:INKS,marginBottom:24}}>{inquiries.length} total inquiries</div>
        {loading&&<div style={{fontSize:14,color:INKS}}>Loading…</div>}
        {!loading&&inquiries.length===0&&<div style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'3rem',textAlign:'center',fontSize:14,color:INKS}}>No inquiries yet. Share your ring builder link to get started.</div>}
        {inquiries.map((inq:any)=>(
          <div key={inq.id} style={{background:W,border:'1px solid '+BDR,borderRadius:12,padding:'16px 18px',marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div>
                <div style={{fontSize:14,fontWeight:500,color:INK}}>{inq.customer_name}</div>
                <div style={{fontSize:12,color:INKS}}>{inq.customer_email}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,background:'#EEEDFE',color:'#534AB7',padding:'2px 8px',borderRadius:20,display:'inline-block',marginBottom:4}}>{inq.status}</div>
                <div style={{fontSize:11,color:INKS}}>{inq.reference_code}</div>
              </div>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {inq.ring_type&&<span style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:'#FAF5EE',color:'#8A6D48',border:'1px solid rgba(181,150,109,0.2)'}}>{inq.ring_type}</span>}
              {inq.selections&&Object.entries(inq.selections).filter(([k])=>['stone','shape','carat','metal','setting','band'].includes(k)).map(([k,v]:any)=>(
                <span key={k} style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:'#FAF5EE',color:'#8A6D48',border:'1px solid rgba(181,150,109,0.2)'}}>{v}</span>
              ))}
            </div>
            {inq.budget_range&&<div style={{fontSize:12,color:INKS,marginTop:8}}>Budget: {inq.budget_range}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
