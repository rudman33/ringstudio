export default function BuilderPage({ params }: { params: { subdomain: string } }) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Ring Builder</h1>
      <p>Subdomain: {params.subdomain}</p>
      <p>Ring builder will load here.</p>
    </div>
  )
}
