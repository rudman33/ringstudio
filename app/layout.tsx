export const metadata = {
  metadataBase: new URL('https://jeweleryengine.com'),
  title: 'Jewelery Engine — White-Label Ring Builder for Jewelers',
  description: 'Let customers design their own engagement ring on your website. AI-rendered previews and qualified inquiries sent to your inbox. 14-day free trial.',
  openGraph: {
    type: 'website',
    siteName: 'Jewelery Engine',
    title: 'Jewelery Engine — White-Label Ring Builder for Jewelers',
    description: 'Customers design the ring on your website. You get the qualified inquiry. 14-day free trial.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jewelery Engine — White-Label Ring Builder for Jewelers',
    description: 'Customers design the ring on your website. You get the qualified inquiry.',
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
          href="https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
