'use client'
import { useState } from 'react'
const G='#B5966D'
export default function Page({params}:{params:{subdomain:string}}){
  const [step,setStep]=useState(1)
  return <div style={{minHeight:'100vh',background:'#F8F3EC',fontFamily:'sans-serif'}}>
    <div style={{padding:'1rem 1.5rem',background:'#fff',borderBottom:'1px solid #eee'}}>
      <span style={{fontFamily:'Georgia',fontSize:20}}>Ring<span style={{color:G}}>Studio</span></span>
    </div>
    <div style={{maxWidth:600,margin:'0 auto',padding:'2rem 1rem'}}>
      <p style={{color:G,fontSize:11,textTransform:'uppercase',letterSpacing:'.1em'}}>Step {step} of 13</p>
      <h1 style={{fontFamily:'Georgia',fontSize:28,fontWeight:300,margin:'6px 0 8px'}}>Full builder coming here</h1>
      <p style={{color:'#9C8470'}}>Subdomain: {params.subdomain}</p>
    </div>
  </div>
}
