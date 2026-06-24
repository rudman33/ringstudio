export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '3rem', maxWidth: 600 }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>💍 Jewelry Engine</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Platform is running successfully.</p>
      <ul style={{ lineHeight: 2, color: '#333' }}>
        <li><a href="/auth/login">Jeweler login</a></li>
        <li><a href="/admin/dashboard">Admin panel</a></li>
        <li><a href="/superadmin">Super admin</a></li>
      </ul>
    </div>
  )
}
