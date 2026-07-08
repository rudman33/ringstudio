'use client'
import { useState, useEffect, useRef, ReactNode } from 'react'

const STAGE='#15110D',STAGE_LINE='rgba(255,255,255,0.10)'
const CREAM='#F8F3EC',CREAM_PALE='#FAF5EE',W='#FFFFFF'
const INK='#1C1612',INKS='#9C8470'
const G='#B5966D',GD='#8A6D48',GL='#E3C698'
const BDR='rgba(181,150,109,0.18)',BDRS='rgba(181,150,109,0.35)'
const MONO='ui-monospace,"SF Mono",Menlo,monospace'

const PLANS=[
  {key:'starter',label:'Starter',price:49,desc:'For a single studio finding its footing online.',features:['1 white-label ring builder','Up to 100 AI designs/month','Unlimited inquiries','Email notifications']},
  {key:'pro',label:'Pro',price:99,desc:'For studios actively growing their online inquiries.',features:['Everything in Starter','Up to 500 AI designs/month','Custom brand colour','Calendly booking integration','Priority support'],popular:true},
  {key:'enterprise',label:'Enterprise',price:249,desc:'For multi-location or high-volume jewelers.',features:['Everything in Pro','Unlimited AI designs','Multiple builder configurations','Dedicated onboarding','Custom integrations']},
]
const STEPS=[
  {n:1,title:'Customer designs',desc:'They pick the stone, shape, and metal, right on your website. Your AI renders a photorealistic preview of that exact ring before they ever pick up the phone.'},
  {n:2,title:'You get the inquiry',desc:'The full design, their contact details, budget, and timeline land straight in your inbox — organised and ready to quote.'},
  {n:3,title:'You close the sale',desc:'Follow up, send a quote, and book a consultation through your own Calendly link. The customer already knows exactly what they want.'},
]
const FEATURES=[
  {code:'EMBED · 01',title:'Embeds anywhere',desc:'WordPress, Wix, Squarespace, GoHighLevel, Webflow, or any site that takes HTML — your logo, your colours, your domain.'},
  {code:'AI · 02',title:'Photorealistic preview',desc:'Every design renders into a real photo of that exact ring, automatically, before the customer submits an inquiry.'},
  {code:'INBOX · 03',title:'Built-in inquiries',desc:'Every inquiry arrives with the full design, contact details, and notes already organised — no spreadsheets.'},
  {code:'STOCK · 04',title:'Your own ring options',desc:'Stock the builder with your real stones, settings, and metals. Customers only see what you actually carry.'},
  {code:'CRM · 05',title:'GoHighLevel sync',desc:'Already on GoHighLevel? Every inquiry is pushed straight into your contacts automatically — no manual entry.'},
]

const SAMPLE_INQUIRIES=[
  {img:'/hero-ring.jpg',name:'Emma R.',email:'emma.r@email.com',stone:'2.0ct Round Diamond',metal:'Platinum',style:'Classic Solitaire',budget:'$15,000–$20,000'},
  {img:'/ring-sapphire.jpg',name:'Sofia M.',email:'sofia.m@email.com',stone:'1.5ct Oval Sapphire',metal:'Rose Gold',style:'Diamond Halo',budget:'$5,000–$10,000'},
  {img:'/ring-emerald.jpg',name:'Olivia K.',email:'olivia.k@email.com',stone:'1.2ct Emerald Cut Emerald',metal:'Yellow Gold',style:'Three Stone',budget:'$10,000–$15,000'},
  {img:'/ring-ruby.jpg',name:'Maya P.',email:'maya.p@email.com',stone:'1.0ct Cushion Ruby',metal:'White Gold',style:'Classic Solitaire',budget:'$5,000–$10,000'},
  {img:'/ring-moissanite.jpg',name:'Grace L.',email:'grace.l@email.com',stone:'1.8ct Round Moissanite',metal:'Two-Tone Gold',style:'Vintage Filigree',budget:'Under $5,000'},
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
  const [scrollY,setScrollY]=useState(0)
  const [reducedMotion,setReducedMotion]=useState(false)
  const [heroIndex,setHeroIndex]=useState(0)
  const [heroPaused,setHeroPaused]=useState(false)
  const imgWrapRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    setMounted(true)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const onScroll=()=>{
      setScrolled(window.scrollY>40)
      setScrollY(window.scrollY)
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

  useEffect(()=>{
    if(heroPaused||reducedMotion)return
    const t=setInterval(()=>setHeroIndex(i=>(i+1)%SAMPLE_INQUIRIES.length),5000)
    return()=>clearInterval(t)
  },[heroPaused,reducedMotion])

  const wrap={maxWidth:1080,margin:'0 auto',padding:'0 24px'} as any
  const eyebrowLight={fontSize:11,color:G,textTransform:'uppercase' as const,letterSpacing:'.14em',fontWeight:600,marginBottom:14,textAlign:'center' as const}
  const eyebrowDark={fontSize:11,color:GL,textTransform:'uppercase' as const,letterSpacing:'.14em',fontWeight:600,marginBottom:16,textAlign:'center' as const}
  const h2={fontFamily:'Cormorant,Georgia,serif',fontSize:38,fontWeight:300,color:INK,marginBottom:14,letterSpacing:'-0.01em',textAlign:'center' as const}
  const ctaBtn={display:'inline-block',background:G,border:'none',borderRadius:9,padding:'15px 30px',fontSize:14,fontWeight:500,color:'#fff',cursor:'pointer',textDecoration:'none',fontFamily:'inherit'} as any
  const ctaBtnGhostDark={display:'inline-block',background:'transparent',border:'1px solid rgba(255,255,255,0.28)',borderRadius:9,padding:'15px 30px',fontSize:14,fontWeight:500,color:'#F4EEE4',cursor:'pointer',textDecoration:'none',fontFamily:'inherit'} as any
  const ctaBtnGhostLight={display:'inline-block',background:'transparent',border:'1px solid '+BDRS,borderRadius:9,padding:'11px 22px',fontSize:13,fontWeight:500,color:INK,cursor:'pointer',textDecoration:'none',fontFamily:'inherit'} as any

  const imgScale=0.9+imgProgress*0.1
  const imgOpacity=0.5+imgProgress*0.5

  return(
    <div style={{background:CREAM,fontFamily:'Montserrat,-apple-system,sans-serif'}}>
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
        .grid-3col > div, .grid-2col > div{opacity:0;transform:translateY(18px);transition:opacity .5s cubic-bezier(.2,.8,.2,1),transform .5s cubic-bezier(.2,.8,.2,1)}
        .reveal-in .grid-3col > div:nth-child(1), .reveal-in .grid-2col > div:nth-child(1){transition-delay:0ms}
        .reveal-in .grid-3col > div:nth-child(2), .reveal-in .grid-2col > div:nth-child(2){transition-delay:100ms}
        .reveal-in .grid-3col > div:nth-child(4){transition-delay:300ms}
        .reveal-in .grid-3col > div:nth-child(5){transition-delay:400ms}
        .reveal-in .grid-3col > div:nth-child(3){transition-delay:200ms}
        .reveal-in .grid-3col > div, .reveal-in .grid-2col > div{opacity:1;transform:translateY(0)}
        @media (prefers-reduced-motion: reduce){
          .rise-1,.rise-2,.rise-3,.reveal{animation:none;transition:none;opacity:1;transform:none}
          .plan-card,.feature-card{transition:none}
          .plan-card:hover,.feature-card:hover{transform:none}
          html{scroll-behavior:auto}
          .grid-3col > div, .grid-2col > div{transition:none !important;opacity:1 !important;transform:none !important}
        }
        @media (max-width: 768px){
          .grid-3col, .grid-2col{grid-template-columns:1fr !important;}
          .hero-title div{font-size:36px !important;}
        }
        @media (max-width: 480px){
          .nav-signin{display:none;}
        }
      `}</style>

      {/* ───────── STICKY NAV ───────── */}
      <div className="nav-shell" style={{
        position:'fixed' as const,top:0,left:0,right:0,zIndex:50,
        background:scrolled?'rgba(21,17,13,0.82)':'transparent',
        backdropFilter:scrolled?'blur(14px)':'none',
        borderBottom:scrolled?'1px solid rgba(255,255,255,0.08)':'1px solid transparent',
      }}>
        <div className="nav-row" style={{...wrap,height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontFamily:'Cormorant,Georgia,serif',fontSize:26,fontWeight:600,color:'#F4EEE4'}}>Jewelry <span style={{color:GL}}>Engine</span></div>
          <div style={{display:'flex',gap:20,alignItems:'center'}}>
            <a href="/auth/login" className="nav-signin" style={{fontSize:13,color:'rgba(244,238,228,0.7)',textDecoration:'none'}}>Sign in</a>
            <a href="/auth/signup" style={{...ctaBtn,padding:'8px 16px',fontSize:13}}>Start your free trial</a>
          </div>
        </div>
      </div>

      {/* ───────── HERO — dark stage, centered, product reveal below ───────── */}
      <div style={{background:STAGE,position:'relative' as const,overflow:'hidden'}}>
        <div style={{position:'absolute' as const,top:'-10%',left:'50%',transform:`translateX(-50%) translateY(${reducedMotion?0:scrollY*0.08}px)`,width:900,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(227,198,152,0.14),transparent 70%)',pointerEvents:'none' as const}}/>

        <div style={{...wrap,padding:'168px 24px 0',textAlign:'center' as const,position:'relative' as const,zIndex:2}}>
          <div className={mounted?'rise-1':''} style={{opacity:mounted?undefined:0}}>
            <div style={eyebrowDark}>White-label ring builder for jewelers</div>
            <h1 className="hero-title" style={{fontFamily:'Cormorant,Georgia,serif',fontWeight:500,color:'#F4EEE4',letterSpacing:'-0.015em',margin:'0 auto'}}>
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
              <a href="/test" target="_blank" style={ctaBtnGhostDark}>See a live builder ↗</a>
            </div>
            <div style={{fontSize:12,color:'rgba(244,238,228,0.45)',marginTop:16}}>14 days free. Cancel anytime during your trial.</div>
          </div>

          {/* Product reveal — sample inquiry carousel, scroll-linked scale */}
          <div ref={imgWrapRef} style={{marginTop:64,paddingBottom:90}} onMouseEnter={()=>setHeroPaused(true)} onMouseLeave={()=>setHeroPaused(false)}>
            <div style={{
              maxWidth:640,margin:'0 auto',position:'relative' as const,
              transform:`scale(${imgScale})`,opacity:imgOpacity,
              transition:'transform .1s linear,opacity .1s linear',
              willChange:'transform,opacity',
            }}>
              <div style={{position:'absolute' as const,top:'10%',left:'50%',transform:'translateX(-50%)',width:'80%',height:'70%',borderRadius:'50%',background:'radial-gradient(circle,rgba(227,198,152,0.22),transparent 70%)',pointerEvents:'none' as const}}/>
              <div style={{position:'relative' as const,borderRadius:20,overflow:'hidden',boxShadow:'0 40px 80px rgba(0,0,0,0.5)',aspectRatio:'1'}}>
                {SAMPLE_INQUIRIES.map((inq,i)=>(
                  <img
                    key={inq.img}
                    src={inq.img}
                    alt={`AI-generated preview of ${inq.stone} in ${inq.metal}, ${inq.style}`}
                    style={{position:'absolute' as const,top:0,left:0,width:'100%',height:'100%',objectFit:'cover',opacity:i===heroIndex?1:0,transition:'opacity .6s ease'}}
                  />
                ))}
              </div>
            </div>

            <div style={{maxWidth:520,margin:'28px auto 0',background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:16,padding:'22px 26px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <span style={{fontFamily:MONO,fontSize:10,color:GL,letterSpacing:'.08em'}}>SAMPLE INQUIRY</span>
                <span style={{fontFamily:MONO,fontSize:10,color:'rgba(244,238,228,0.45)',letterSpacing:'.08em'}}>RECEIVED JUST NOW</span>
              </div>

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <div style={{textAlign:'left' as const}}>
                  <div style={{fontSize:10,color:'rgba(244,238,228,0.5)',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:3}}>Contact</div>
                  <div style={{fontSize:16,color:'#F4EEE4',fontWeight:600}}>{SAMPLE_INQUIRIES[heroIndex].name}</div>
                </div>
                <div style={{fontSize:12,color:'rgba(244,238,228,0.55)'}}>{SAMPLE_INQUIRIES[heroIndex].email}</div>
              </div>

              <div style={{fontSize:10,color:'rgba(244,238,228,0.5)',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:10,textAlign:'left' as const}}>Ring preferences</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:16}}>
                <div>
                  <div style={{fontSize:10,color:'rgba(244,238,228,0.5)',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:4}}>Stone</div>
                  <div style={{fontSize:14,color:'#F4EEE4',fontWeight:500}}>{SAMPLE_INQUIRIES[heroIndex].stone}</div>
                </div>
                <div>
                  <div style={{fontSize:10,color:'rgba(244,238,228,0.5)',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:4}}>Style</div>
                  <div style={{fontSize:14,color:'#F4EEE4',fontWeight:500}}>{SAMPLE_INQUIRIES[heroIndex].style}</div>
                </div>
                <div>
                  <div style={{fontSize:10,color:'rgba(244,238,228,0.5)',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:4}}>Metal</div>
                  <div style={{fontSize:14,color:'#F4EEE4',fontWeight:500}}>{SAMPLE_INQUIRIES[heroIndex].metal}</div>
                </div>
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:14,display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:16}}>
                <span style={{fontSize:12,color:'rgba(244,238,228,0.55)'}}>Budget</span>
                <span style={{fontFamily:MONO,fontSize:18,color:GL,fontWeight:700}}>{SAMPLE_INQUIRIES[heroIndex].budget}</span>
              </div>

              <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:12}}>
                {SAMPLE_INQUIRIES.map((inq,i)=>(
                  <button
                    key={inq.img}
                    onClick={()=>setHeroIndex(i)}
                    aria-label={`Show sample inquiry ${i+1}`}
                    style={{width:i===heroIndex?22:8,height:8,borderRadius:4,border:'none',cursor:'pointer',background:i===heroIndex?G:'rgba(255,255,255,0.2)',transition:'width .3s ease,background .3s ease',padding:0}}
                  />
                ))}
              </div>
              <div style={{fontSize:11,color:'rgba(244,238,228,0.4)',fontStyle:'italic' as const,textAlign:'center' as const}}>Sample inquiry for illustration — this is what lands in your inbox automatically</div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── HOW IT WORKS ───────── */}
      <Reveal>
        <div style={{...wrap,padding:'120px 24px 88px',textAlign:'center' as const}}>
          <div style={eyebrowLight}>How it works</div>
          <h2 style={h2}>From browsing to <em style={{fontStyle:'italic',color:G}}>booked</em>, in three steps.</h2>
          <div className="grid-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32,marginTop:48,textAlign:'left' as const}}>
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
          <div className="grid-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginTop:44,textAlign:'left' as const}}>
            {FEATURES.map(f=>(
              <div key={f.title} className="feature-card" style={{background:W,border:'1px solid '+BDR,borderRadius:14,padding:'26px 26px'}}>
                <div style={{fontFamily:MONO,fontSize:10,color:G,letterSpacing:'.08em',marginBottom:10}}>{f.code}</div>
                <div style={{fontSize:15,fontWeight:500,color:INK,marginBottom:6}}>{f.title}</div>
                <div style={{fontSize:13,color:INKS,lineHeight:1.6}}>{f.desc}</div>
                {f.code==='EMBED · 01'&&
                  <div style={{display:'flex',alignItems:'center',gap:14,marginTop:16,paddingTop:16,borderTop:'1px solid '+BDR,flexWrap:'wrap' as const}}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill={INKS} role="img" aria-label="WordPress"><title>WordPress</title><path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/></svg>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill={INKS} role="img" aria-label="Wix"><title>Wix</title><path d="m0 7.354 2.113 9.292h.801a1.54 1.54 0 0 0 1.506-1.218l1.351-6.34a.171.171 0 0 1 .167-.137c.08 0 .15.058.167.137l1.352 6.34a1.54 1.54 0 0 0 1.506 1.218h.805l2.113-9.292h-.565c-.62 0-1.159.43-1.296 1.035l-1.26 5.545-1.106-5.176a1.76 1.76 0 0 0-2.19-1.324c-.639.176-1.113.716-1.251 1.365l-1.094 5.127-1.26-5.537A1.33 1.33 0 0 0 .563 7.354H0zm13.992 0a.951.951 0 0 0-.951.95v8.342h.635a.952.952 0 0 0 .951-.95V7.353h-.635zm1.778 0 3.158 4.66-3.14 4.632h1.325c.368 0 .712-.181.918-.486l1.756-2.59a.12.12 0 0 1 .197 0l1.754 2.59c.206.305.55.486.918.486h1.326l-3.14-4.632L24 7.354h-1.326c-.368 0-.712.181-.918.486l-1.772 2.617a.12.12 0 0 1-.197 0L18.014 7.84a1.108 1.108 0 0 0-.918-.486H15.77z"/></svg>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill={INKS} role="img" aria-label="Squarespace"><title>Squarespace</title><path d="M22.655 8.719c-1.802-1.801-4.726-1.801-6.564 0l-7.351 7.35c-.45.45-.45 1.2 0 1.65.45.449 1.2.449 1.65 0l7.351-7.351c.899-.899 2.362-.899 3.264 0 .9.9.9 2.364 0 3.264l-7.239 7.239c.9.899 2.362.899 3.263 0l5.589-5.589c1.836-1.838 1.836-4.763.037-6.563zm-2.475 2.437c-.451-.45-1.201-.45-1.65 0l-7.354 7.389c-.9.899-2.361.899-3.262 0-.45-.45-1.2-.45-1.65 0s-.45 1.2 0 1.649c1.801 1.801 4.726 1.801 6.564 0l7.351-7.35c.449-.487.449-1.239.001-1.688zm-2.439-7.35c-1.801-1.801-4.726-1.801-6.564 0l-7.351 7.351c-.45.449-.45 1.199 0 1.649s1.2.45 1.65 0l7.395-7.351c.9-.899 2.371-.899 3.27 0 .451.45 1.201.45 1.65 0 .421-.487.421-1.199-.029-1.649h-.021zm-2.475 2.437c-.45-.45-1.2-.45-1.65 0l-7.351 7.389c-.899.9-2.363.9-3.265 0-.9-.899-.9-2.363 0-3.264l7.239-7.239c-.9-.9-2.362-.9-3.263 0L1.35 8.719c-1.8 1.8-1.8 4.725 0 6.563 1.801 1.801 4.725 1.801 6.564 0l7.35-7.351c.451-.488.451-1.238 0-1.688h.002z"/></svg>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill={INKS} role="img" aria-label="Webflow"><title>Webflow</title><path d="m24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z"/></svg>
                  </div>
                }
                {f.code==='CRM · 05'&&
                  <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid '+BDR}}>
                    <span style={{display:'inline-block',fontFamily:MONO,fontSize:11,fontWeight:700,letterSpacing:'.04em',color:G,background:CREAM_PALE,border:'1px solid '+BDR,borderRadius:6,padding:'4px 10px'}}>GoHighLevel</span>
                  </div>
                }
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
          <div className="grid-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:48,textAlign:'left' as const}}>
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
          <div style={{fontSize:12,color:INKS,marginTop:28}}>Every plan includes a 14-day free trial. No setup fees. Need more designs? Extra packs of 50 are $25.</div>
        </div>
      </Reveal>

      {/* ───────── CLOSING — dark stage, echoes hero ───────── */}
      <Reveal>
        <div style={{background:STAGE,position:'relative' as const,overflow:'hidden'}}>
          <div style={{position:'absolute' as const,bottom:'-30%',left:'50%',transform:`translateX(-50%) translateY(${reducedMotion?0:-scrollY*0.05}px)`,width:700,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(227,198,152,0.14),transparent 70%)',pointerEvents:'none' as const}}/>
          <div style={{...wrap,padding:'120px 24px',textAlign:'center' as const,position:'relative' as const,zIndex:2}}>
            <h2 style={{fontFamily:'Cormorant,Georgia,serif',fontSize:36,fontWeight:500,color:'#F4EEE4',marginBottom:24}}>
              Ready for customers to <em style={{fontStyle:'italic',color:GL}}>design it</em> themselves?
            </h2>
            <a href="/auth/signup" style={ctaBtn}>Start your free trial</a>
          </div>
          <div style={{borderTop:'1px solid '+STAGE_LINE,position:'relative' as const,zIndex:2}}>
            <div style={{...wrap,padding:'24px 24px',display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(244,238,228,0.45)',flexWrap:'wrap' as const,gap:12}}>
              <div>© {new Date().getFullYear()} Jewelry Engine</div>
              <div style={{display:'flex',gap:18}}>
                <a href="/auth/login" style={{color:'rgba(244,238,228,0.6)',textDecoration:'none'}}>Sign in</a>
                <a href="/test" target="_blank" style={{color:'rgba(244,238,228,0.6)',textDecoration:'none'}}>Live demo</a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
