export const metadata = {
  metadataBase: new URL('https://ringstudio.ca'),
  title: 'Ring Studio — White-Label Ring Builder for Jewelers',
  description: 'Let customers design their own engagement ring on your website. AI-rendered previews and qualified inquiries sent to your inbox. 14-day free trial.',
  openGraph: {
    type: 'website',
    siteName: 'Ring Studio',
    title: 'Ring Studio — White-Label Ring Builder for Jewelers',
    description: 'Customers design the ring on your website. You get the qualified inquiry. 14-day free trial.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Ring Studio ring builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ring Studio — White-Label Ring Builder for Jewelers',
    description: 'Customers design the ring on your website. You get the qualified inquiry.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
