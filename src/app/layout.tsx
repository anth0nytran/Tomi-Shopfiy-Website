import type { Metadata } from 'next'
import './globals.css'
import '../styles/legacy.css'
import { ClientInit } from '@/components/ClientInit'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Tomi - Solid Gold Jewelry in Houston',
  description: 'Solid gold jewelry that shines best on you. Timeless designs, not microtrends.',
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
        <link href="https://fonts.googleapis.com/css2?family=Reckless+Neue:wght@400;500;600&family=Neue+Haas+Grotesk+Display:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body text-ink bg-white antialiased">
        <Providers>
          <ClientInit />
          {children}
        </Providers>
      </body>
    </html>
  )
}
