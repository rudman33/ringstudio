'use client'
import { useState, useEffect, useRef, ReactNode } from 'react'

const STAGE='#15110D',STAGE_LINE='rgba(255,255,255,0.10)'
const CREAM='#F8F3EC',CREAM_PALE='#FAF5EE',W='#FFFFFF'
const INK='#1C1612',INKS='#9C8470'
const G='#B5966D',GD='#8A6D48',GL='#E3C698'
const BDR='rgba(181,150,109,0.18)',BDRS='rgba(181,150,109,0.35)'
const MONO='ui-monospace,"SF Mono",Menlo,monospace'

const PLANS=[
  {key:'starter',label:'Starter',price:49,desc:'For a single studio finding its footing online.',features:['1 white-label ring builder','AI photorealistic previews','Unlimited inquiries','Email notifications']},
  {key:'pro',label:'Pro',price:99,desc:'For studios actively growing their online inquiries.',features:['Everything in Starter','Custom brand colour','Calendly booking integration','Priority support'],popular:true},
  {key:'enterprise',label:'Enterprise',price:249,desc:'For multi-location or high-volume jewelers.',features:['Everything in Pro','Multiple builder configurations','Dedicated onboarding','Custom integrations']},
]
const STEPS=[
  {n:1,title:'Customer designs',desc:'They pick the stone, shape, and metal, right on your website. Your AI renders a photorealistic preview of that exact ring before they ever pick up the phone.'},
  {n:2,title:'You get the inquiry',desc:'The full design, their contact details, budget, and timeline land straight in your inbox — organised and ready to quote.'},
  {n:3,title:'You close the sale',desc:'Follow up, send a quote, and book a consultation through your own Calendly link. The customer already knows exactly what they want.'},
]
const FEATURES=[
  {code:'EMBED · 01',title:'White-label embed',desc:'Looks like your site, not ours. Drop it into WordPress, HighLevel, or anywhere else — your logo, your colours, your domain.'},
  {code:'AI · 02',title:'Photorealistic preview',desc:'Every design renders into a real photo of that exact ring, automatically, before the customer submits an inquiry.'},
  {code:'INBOX · 03',title:'Built-in inquiries',desc:'Every inquiry arrives with the full design, contact details, and notes already organised — no spreadsheets.'},
  {code:'STOCK · 04',title:'Your own ring options',desc:'Stock the builder with your real stones, settings, and metals. Customers only see what you actually carry.'},
]

function Reveal({children}:{children:ReactNode}){
  const ref=useRef<HTMLDivElement>(null)
  const [visible,setVisible]=useState(false)
  useEffect(()=>{
    const el=ref.current
    if(!el)return
    const obs=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){setVisible(true);obs.disconnect()}
    },{threshold:0.15})
    obs.observe(el)
    return()=>obs.disconnect()
  },[])
  return <div ref={ref} className={`reveal ${visible?'reveal-in':''}`}>{children}</div>
}

export default function MarketingPage(){
  const [scrolled,setScrolled]=useState(false)
  const [mounted,setMounted]=useState(false)
  const [imgProgress,setImgProgress]=useState(0)
  const imgWrapRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    setMounted(true)
    const onScroll=()=>{
      setScrolled(window.scrollY>40)
      const el=imgWrapRef.current
      if(el){
        const rect=el.getBoundingClientRect()
        const vh=window.innerHeight
        const raw=(vh-rect.top)/(vh*0.7)
        setImgProgress(Math.min(1,Math.max(0,raw)))
      }
    }
    onScroll()
    window.addEventListener('scroll',onScroll,{passive:true})
    return()=>window.removeEventListener('scroll',onScroll)
  },[])

  const wrap={maxWidth:1080,margin:'0 auto',padding:'0 24px'} as any
  const eyebrowLight={fontSize:11,color:G,textTransform:'uppercase' as const,letterSpacing:'.14em',fontWeight:600,marginBottom:14,textAlign:'center' as const}
  const eyebrowDark={fontSize:11,color:GL,textTransform:'uppercase' as const,letterSpacing:'.14em',fontWeight:600,marginBottom:16,textAlign:'center' as const}
  const h2={fontFamily:'Georgia,serif',fontSize:38,fontWeight:300,color:INK,marginBottom:14,letterSpacing:'-0.01em',textAlign:'center' as const}
  const ctaBtn={display:'inline-block',background:G,border:'none',borderRadius:9,padding:'15px 30px',fontSize:14,fontWeight:500,color:'#fff',cursor:'pointer',textDecoration:'none',fontFamily:'inherit'} as any
  const ctaBtnGhostDark={display:'inline-block',background:'transparent',border:'1px solid rgba(255,255,255,0.28)',borderRadius:9,padding:'15px 30px',fontSize:14,fontWeight:500,color:'#F4EEE4',cursor:'pointer',textDecoration:'none',fontFamily:'inherit'} as any
  const ctaBtnGhostLight={display:'inline-block',background:'transparent',border:'1px solid '+BDRS,borderRadius:9,padding:'11px 22px',fontSize:13,fontWeight:500,color:INK,cursor:'pointer',textDecoration:'none',fontFamily:'inherit'} as any

  const imgScale=0.9+imgProgress*0.1
  const imgOpacity=0.5+imgProgress*0.5

  return(
    <div style={{background:CREAM}}>
      <style>{`
        html{scroll-behavior:smooth}
        @keyframes riseIn{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
        .rise-1{animation:riseIn .8s cubic-bezier(.2,.8,.2,1) both}
        .rise-2{animation:riseIn .8s cubic-bezier(.2,.8,.2,1) .15s both}
        .rise-3{animation:riseIn .8s cubic-bezier(.2,.8,.2,1) .3s both}
        .reveal{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}
        .reveal-in{opacity:1;transform:translateY(0)}
        .plan-card{transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s ease}
        .plan-card:hover{transform:translateY(-5px);box-shadow:0 16px 34px rgba(28,22,18,0.09)}
        .feature-card{transition:border-color .2s ease,transform .25s cubic-bezier(.2,.8,.2,1)}
        .feature-card:hover{border-color:${BDRS};transform:translateY(-3px)}
        .nav-shell{transition:background-color .35s ease,backdrop-filter .35s ease,border-color .35s ease}
        @media (prefers-reduced-motion: reduce){
          .rise-1,.rise-2,.rise-3,.reveal{animation:none;transition:none;opacity:1;transform:none}
          .plan-card,.feature-card{transition:none}
          .plan-card:hover,.feature-card:hover{transform:none}
          html{scroll-behavior:auto}
        }
      `}</style>

      {/* ───────── STICKY NAV ───────── */}
      <div className="nav-shell" style={{
        position:'fixed' as const,top:0,left:0,right:0,zIndex:50,
        background:scrolled?'rgba(21,17,13,0.82)':'transparent',
        backdropFilter:scrolled?'blur(14px)':'none',
        borderBottom:scrolled?'1px solid rgba(255,255,255,0.08)':'1px solid transparent',
      }}>
        <div style={{...wrap,height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:19,color:'#F4EEE4'}}>Jewelry<span style={{color:GL}}>Engine</span></div>
          <div style={{display:'flex',gap:20,alignItems:'center'}}>
            <a href="/auth/login" style={{fontSize:13,color:'rgba(244,238,228,0.7)',textDecoration:'none'}}>Sign in</a>
            <a href="/auth/signup" style={{...ctaBtn,padding:'8px 16px',fontSize:13}}>Start your free trial</a>
          </div>
        </div>
      </div>

      {/* ───────── HERO — dark stage, centered, product reveal below ───────── */}
      <div style={{background:STAGE,position:'relative' as const,overflow:'hidden'}}>
        <div style={{position:'absolute' as const,top:'-10%',left:'50%',transform:'translateX(-50%)',width:900,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(227,198,152,0.14),transparent 70%)',pointerEvents:'none' as const}}/>

        <div style={{...wrap,padding:'168px 24px 0',textAlign:'center' as const,position:'relative' as const,zIndex:2}}>
          <div className={mounted?'rise-1':''} style={{opacity:mounted?undefined:0}}>
            <div style={eyebrowDark}>White-label ring builder for jewelers</div>
            <h1 style={{fontFamily:'Georgia,serif',fontWeight:300,color:'#F4EEE4',letterSpacing:'-0.015em',margin:'0 auto'}}>
              <div style={{fontSize:54,lineHeight:1.18}}>Your customers <em style={{fontStyle:'italic',color:GL}}>design</em> it.</div>
              <div style={{fontSize:54,lineHeight:1.18}}>You quote it. They buy it.</div>
            </h1>
          </div>
          <div className={mounted?'rise-2':''} style={{opacity:mounted?undefined:0,maxWidth:560,margin:'26px auto 0'}}>
            <p style={{fontSize:17,color:'rgba(244,238,228,0.72)',lineHeight:1.7,margin:0}}>
              An interactive ring builder lives right on your website. Customers choose the stone, shape, and metal — your AI renders a photorealistic preview — and every inquiry lands in your inbox, ready to quote.
            </p>
          </div>
          <div className={mounted?'rise-3':''} style={{opacity:mounted?undefined:0,marginTop:32}}>
            <div style={{display:'flex',gap:12,flexWrap:'wrap' as const,justifyContent:'center'}}>
              <a href="/auth/signup" style={ctaBtn}>Start your free trial</a>
              <a href="/demo" target="_blank" style={ctaBtnGhostDark}>See a live builder ↗</a>
            </div>
            <div style={{fontSize:12,color:'rgba(244,238,228,0.45)',marginTop:16}}>14 days free. Cancel anytime during your trial.</div>
          </div>

          {/* Product reveal — large, uncluttered, scroll-linked scale */}
          <div ref={imgWrapRef} style={{marginTop:64,paddingBottom:90}}>
            <div style={{
              maxWidth:640,margin:'0 auto',position:'relative' as const,
              transform:`scale(${imgScale})`,opacity:imgOpacity,
              transition:'transform .1s linear,opacity .1s linear',
              willChange:'transform,opacity',
            }}>
              <div style={{position:'absolute' as const,top:'10%',left:'50%',transform:'translateX(-50%)',width:'80%',height:'70%',borderRadius:'50%',background:'radial-gradient(circle,rgba(227,198,152,0.22),transparent 70%)',pointerEvents:'none' as const}}/>
              <img src="/hero-ring.jpg" alt="AI-generated preview of a 2.0 ct round brilliant diamond solitaire in platinum" style={{width:'100%',display:'block',borderRadius:20,position:'relative' as const,zIndex:1,boxShadow:'0 40px 80px rgba(0,0,0,0.5)'}}/>
            </div>
            <div style={{maxWidth:520,margin:'28px auto 0',background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:16,padding:'22px 26px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <span style={{fontFamily:MONO,fontSize:18,color:'#F4EEE4',fontWeight:700}}>2.0 ct Round Brilliant</span>
                <span style={{fontFamily:MONO,fontSize:11,color:GL,letterSpacing:'.08em'}}>SPEC NO. JE-00482</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:16}}>
                <div>
                  <div style={{fontSize:10,color:'rgba(244,238,228,0.5)',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:4}}>Stone</div>
                  <div style={{fontSize:15,color:'#F4EEE4',fontWeight:500}}>Diamond</div>
                </div>
                <div>
                  <div style={{fontSize:10,color:'rgba(244,238,228,0.5)',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:4}}>Setting</div>
                  <div style={{fontSize:15,color:'#F4EEE4',fontWeight:500}}>Solitaire</div>
                </div>
                <div>
                  <div style={{fontSize:10,color:'rgba(244,238,228,0.5)',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:4}}>Metal</div>
                  <div style={{fontSize:15,color:'#F4EEE4',fontWeight:500}}>Platinum</div>
                </div>
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:14,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                <span style={{fontSize:12,color:'rgba(244,238,228,0.55)'}}>Estimated value</span>
                <span style={{fontFamily:MONO,fontSize:22,color:GL,fontWeight:700}}>$18,500</span>
              </div>
              <div style={{fontSize:11,color:'rgba(244,238,228,0.4)',marginTop:14,fontStyle:'italic' as const,textAlign:'center' as const}}>AI-generated visualization, rendered the moment a customer finishes designing — actual ring may vary</div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── HOW IT WORKS ───────── */}
      <Reveal>
        <div style={{...wrap,padding:'120px 24px 88px',textAlign:'center' as const}}>
          <div style={eyebrowLight}>How it works</div>
          <h2 style={h2}>From browsing to <em style={{fontStyle:'italic',color:G}}>booked</em>, in three steps.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32,marginTop:48,textAlign:'left' as const}}>
            {STEPS.map(s=>(
              <div key={s.n}>
                <div style={{width:40,height:40,borderRadius:'50%',border:'1.5px solid '+BDRS,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18}}>
                  <span style={{fontFamily:MONO,fontSize:14,color:G,fontWeight:700}}>{String(s.n).padStart(2,'0')}</span>
                </div>
                <div style={{fontSize:16,fontWeight:500,color:INK,marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:13,color:INKS,lineHeight:1.65}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ───────── FEATURES ───────── */}
      <Reveal>
        <div style={{...wrap,padding:'40px 24px 104px',textAlign:'center' as const}}>
          <div style={eyebrowLight}>Built for jewelers</div>
          <h2 style={h2}>Everything your studio needs, <em style={{fontStyle:'italic',color:G}}>nothing</em> it doesn’t.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16,marginTop:44,textAlign:'left' as const}}>
            {FEATURES.map(f=>(
              <div key={f.title} className="feature-card" style={{background:W,border:'1px solid '+BDR,borderRadius:14,padding:'26px 26px'}}>
                <div style={{fontFamily:MONO,fontSize:10,color:G,letterSpacing:'.08em',marginBottom:10}}>{f.code}</div>
                <div style={{fontSize:15,fontWeight:500,color:INK,marginBottom:6}}>{f.title}</div>
                <div style={{fontSize:13,color:INKS,lineHeight:1.6}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ───────── PRICING ───────── */}
      <Reveal>
        <div style={{...wrap,padding:'40px 24px 112px',textAlign:'center' as const}}>
          <div style={eyebrowLight}>Pricing</div>
          <h2 style={h2}>One plan for <em style={{fontStyle:'italic',color:G}}>every</em> stage of your studio.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:48,textAlign:'left' as const}}>
            {PLANS.map(p=>(
              <div key={p.key} className="plan-card" style={{background:W,border:p.popular?'2px solid '+G:'1px solid '+BDR,borderRadius:16,padding:'30px 26px',position:'relative' as const}}>
                {p.popular&&<div style={{position:'absolute' as const,top:-11,left:26,background:G,color:'#fff',fontSize:10,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase' as const,padding:'4px 10px',borderRadius:20}}>Most popular</div>}
                <div style={{fontSize:14,fontWeight:500,color:INK,marginBottom:6}}>{p.label}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:10}}>
                  <span style={{fontFamily:MONO,fontSize:34,color:INK,fontWeight:700}}>${p.price}</span>
                  <span style={{fontSize:13,color:INKS}}>/month</span>
                </div>
                <div style={{fontSize:13,color:INKS,marginBottom:20,lineHeight:1.55,minHeight:40}}>{p.desc}</div>
                <a href={`/auth/signup?plan=${p.key}`} style={{...(p.popular?ctaBtn:ctaBtnGhostLight),display:'block',textAlign:'center' as const,marginBottom:22,padding:'11px 0'}}>Start your free trial</a>
                <div style={{borderTop:'1px solid '+BDR,paddingTop:18}}>
                  {p.features.map(f=>(
                    <div key={f} style={{display:'flex',gap:8,fontSize:13,color:INK,marginBottom:10,alignItems:'flex-start'}}>
                      <span style={{color:G}}>✓</span><span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:INKS,marginTop:28}}>Every plan includes a 14-day free trial. No setup fees.</div>
        </div>
      </Reveal>

      {/* ───────── CLOSING — dark stage, echoes hero ───────── */}
      <Reveal>
        <div style={{background:STAGE,position:'relative' as const,overflow:'hidden'}}>
          <div style={{position:'absolute' as const,bottom:'-30%',left:'50%',transform:'translateX(-50%)',width:700,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(227,198,152,0.14),transparent 70%)',pointerEvents:'none' as const}}/>
          <div style={{...wrap,padding:'120px 24px',textAlign:'center' as const,position:'relative' as const,zIndex:2}}>
            <h2 style={{fontFamily:'Georgia,serif',fontSize:36,fontWeight:300,color:'#F4EEE4',marginBottom:24}}>
              Ready for customers to <em style={{fontStyle:'italic',color:GL}}>design it</em> themselves?
            </h2>
            <a href="/auth/signup" style={ctaBtn}>Start your free trial</a>
          </div>
          <div style={{borderTop:'1px solid '+STAGE_LINE,position:'relative' as const,zIndex:2}}>
            <div style={{...wrap,padding:'24px 24px',display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(244,238,228,0.45)',flexWrap:'wrap' as const,gap:12}}>
              <div>© {new Date().getFullYear()} Jewelry Engine</div>
              <div style={{display:'flex',gap:18}}>
                <a href="/auth/login" style={{color:'rgba(244,238,228,0.6)',textDecoration:'none'}}>Sign in</a>
                <a href="/demo" target="_blank" style={{color:'rgba(244,238,228,0.6)',textDecoration:'none'}}>Live demo</a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
