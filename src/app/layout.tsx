import type { Metadata } from 'next'
import './globals.css'
import '../styles/legacy.css'
import { ClientInit } from '@/components/ClientInit'
import Script from 'next/script'
import { Providers } from '@/components/Providers'
import localFont from 'next/font/local'

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
  title: 'Tomi - Solid Gold Jewelry in Houston',
  description: 'Solid gold jewelry that shines best on you. Timeless designs, not microtrends.',
  icons: {
    icon: '/assets/pink_tomi_logo.png',
    shortcut: '/assets/pink_tomi_logo.png',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Critical CSS for sticky footer - prevents layout shift */}
        <style dangerouslySetInnerHTML={{ __html: `
          html { height: 100%; }
          body { min-height: 100%; min-height: 100dvh; margin: 0; display: flex; flex-direction: column; }
          body > div:first-child { display: flex !important; flex-direction: column !important; flex: 1 0 auto !important; }
          main { display: flex !important; flex-direction: column !important; flex: 1 0 auto !important; }
          main > .flex-1 { flex: 1 0 auto !important; }
          .footer, footer { flex-shrink: 0 !important; margin-top: auto !important; }
        ` }} />
        <Script id="set-header-vars" strategy="beforeInteractive">
          {`(function(){function setVars(){try{var s=document.getElementById('tomi-root-vars');if(!s){s=document.createElement('style');s.id='tomi-root-vars';document.head.appendChild(s);}var b=document.querySelector('.announcement-bar');var h=document.querySelector('.header');var bh=b?Math.round(b.getBoundingClientRect().height)||0:0;var hh=h?Math.round(h.getBoundingClientRect().height)||72:72;s.textContent=':root{--header-top:'+bh+'px;--header-offset:'+(bh+hh+2)+'px;}';}catch(e){}} if(document.readyState!=='loading'){setVars();}else{document.addEventListener('DOMContentLoaded', setVars);} })();`}
        </Script>
      </head>
      <body className={`${neueHaasGrotesk.variable} ${recklessNeue.variable} font-body text-ink bg-white antialiased`}>
        <Providers>
          <ClientInit />
          {children}
        </Providers>
      </body>
    </html>
  )
}
