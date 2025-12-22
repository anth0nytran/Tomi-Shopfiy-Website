import type { Metadata } from 'next'
import './globals.css'
import '../styles/legacy.css'
import { ClientInit } from '@/components/ClientInit'
import Script from 'next/script'
import { Providers } from '@/components/Providers'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { KlaviyoDelayedTrack } from '@/components/KlaviyoDelayedTrack'
import { KlaviyoDelayedOpenForm } from '@/components/KlaviyoDelayedOpenForm'
import { getPublicSiteOrigin } from '@/lib/site-url'

const recklessNeue = localFont({
  src: [
    { path: '../fonts/RecklessNeue-Regular.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-heading',
  display: 'swap',
})

const neueHaasGrotesk = localFont({
  src: [
    { path: '../fonts/NeueHaasDisplayThin.ttf', weight: '200', style: 'normal' },
    { path: '../fonts/NeueHaasDisplayLight.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/NeueHaasDisplayRoman.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/NeueHaasDisplayMediu.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/NeueHaasDisplayBold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteOrigin()),
  title: 'Tomi - Solid Gold Jewelry in Houston',
  description: 'Solid gold jewelry that shines best on you. Timeless designs, not microtrends.',
  icons: {
    icon: '/assets/pink_tomi_logo.png',
    shortcut: '/assets/pink_tomi_logo.png',
  },
  openGraph: {
    title: 'Tomi - Solid Gold Jewelry in Houston',
    description: 'Solid gold jewelry that shines best on you. Timeless designs, not microtrends.',
    type: 'website',
    images: [
      {
        // iMessage link previews generally prefer PNG/JPG over SVG.
        url: '/assets/large tomi logo.png',
        width: 1200,
        height: 630,
        alt: 'Tomi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tomi - Solid Gold Jewelry in Houston',
    description: 'Solid gold jewelry that shines best on you. Timeless designs, not microtrends.',
    images: ['/assets/large tomi logo.png'],
  },
}

import { TomiReveal } from '@/components/layout/TomiReveal'
import { LaunchCountdown } from '@/components/layout/LaunchCountdown'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Script
          id="umami"
          src="https://cloud.umami.is/script.js"
          data-website-id="c3608ebe-37a7-42d1-99b1-4961bc67ef92"
          strategy="afterInteractive"
          defer
        />
        {/* Critical CSS for sticky footer - prevents layout shift */}
        <style dangerouslySetInnerHTML={{ __html: `
          html { height: 100%; }
          body { min-height: 100%; min-height: 100dvh; margin: 0; display: flex; flex-direction: column; }
        ` }} />
        <Script id="klaviyo-onsite-queue" strategy="beforeInteractive">
          {`window._klOnsite = window._klOnsite || [];`}
        </Script>
        <Script
          id="klaviyo-onsite"
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WJKaN6"
          strategy="afterInteractive"
        />
        <Script id="set-header-vars" strategy="beforeInteractive">
          {`(function(){function setVars(){try{var s=document.getElementById('tomi-root-vars');if(!s){s=document.createElement('style');s.id='tomi-root-vars';document.head.appendChild(s);}var b=document.querySelector('.announcement-bar');var h=document.querySelector('.header');var bh=b?Math.round(b.getBoundingClientRect().height)||0:0;var hh=h?Math.round(h.getBoundingClientRect().height)||72:72;s.textContent=':root{--header-top:'+bh+'px;--header-offset:'+(bh+hh+2)+'px;}';}catch(e){}} if(document.readyState!=='loading'){setVars();}else{document.addEventListener('DOMContentLoaded', setVars);} })();`}
        </Script>
      </head>
      <body className={`${neueHaasGrotesk.variable} ${recklessNeue.variable} font-body text-ink antialiased`}>
        <Providers>
          <LaunchCountdown />
          <ClientInit />
          <KlaviyoDelayedTrack />
          <KlaviyoDelayedOpenForm formId="YvugMg" delayMs={7000} suppressDays={7} />
          <div className="relative z-20 bg-white mb-[100vh] rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl flex flex-col min-h-screen">
            {children}
          </div>
          <TomiReveal height="100vh" variant="editorial" />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
