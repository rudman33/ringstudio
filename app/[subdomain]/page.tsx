'use client'
import { useState } from 'react'

export default function BuilderPage({ params }: { params: { subdomain: string } }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F3EC' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#1C1612', marginBottom: 4 }}>
          Ring<span style={{ color: '#B5966D' }}>Studio</span>
        </div>
        <div style={{ fontSize: 13, color: '#9C8470', marginBottom: 24 }}>
          Designing for: {params.subdomain}
        </div>
        <div style={{ background: '#fff', border: '1px solid rgba(181,150,109,0.2)', borderRadius: 14, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💍</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1C1612', marginBottom: 8 }}>
            Your Ring Builder
          </div>
          <div style={{ fontSize: 14, color: '#9C8470', marginBottom: 24, lineHeight: 1.6 }}>
            The full 13-step ring builder will be embedded here.<br />
            Subdomain: <strong>{params.subdomain}</strong>
          </div>
          <div style={{ display: 'inline-block', background: '#B5966D', color: '#fff', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
            Coming soon — full builder
          </div>
        </div>
      </div>
    </div>
  )
}
