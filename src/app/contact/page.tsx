import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import FAQ from '@/components/sections/FAQ'
import { ContactForm } from './ContactForm'

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const intent = typeof searchParams?.intent === 'string' ? searchParams.intent : undefined
  const source = typeof searchParams?.source === 'string' ? searchParams.source : undefined

  const utm = {
    utmSource: typeof searchParams?.utm_source === 'string' ? searchParams.utm_source : '',
    utmMedium: typeof searchParams?.utm_medium === 'string' ? searchParams.utm_medium : '',
    utmCampaign: typeof searchParams?.utm_campaign === 'string' ? searchParams.utm_campaign : '',
    utmTerm: typeof searchParams?.utm_term === 'string' ? searchParams.utm_term : '',
    utmContent: typeof searchParams?.utm_content === 'string' ? searchParams.utm_content : '',
  }

  return (
    <main className="bg-[#F9F8F6] flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        <section className="w-full pt-44 pb-20 md:pt-56 md:pb-32 px-6 md:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              
              {/* Left Side: Header & Info */}
              <div>
                <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                  Get in Touch
                </span>
                <h1 className="font-heading text-4xl md:text-6xl text-stone-900 mb-8 leading-none">
                  Contact Us
                </h1>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-12 max-w-md">
                  Please don’t hesitate to reach out if you have any questions at all! Whether you need help with an order or just want to say hello.
                </p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Email</h3>
                    <a href="mailto:hello@tomijewelry.com" className="text-stone-600 hover:text-stone-900 transition-colors">Support@tomijewelry.com</a>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Partnerships & Collabs</h3>
                    <p className="text-stone-600 mb-1">Interested in partnering with us?</p>
                    <a href="mailto:marketing@tomijewelry.com" className="text-stone-600 hover:text-stone-900 transition-colors">marketing@tomijewelry.com</a>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Careers</h3>
                    <a href="mailto:careers@tomijewelry.com" className="text-stone-600 hover:text-stone-900 transition-colors">careers@tomijewelry.com</a>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Showroom</h3>
                    <p className="text-stone-600">2810 Riverby Rd. STE 104<br/>Houston, Texas 77020</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="bg-white border border-stone-100 p-8 md:p-12 rounded-sm shadow-sm">
                <ContactForm
                  initialIntent={intent as any}
                  source={source}
                  utm={utm}
                />
              </div>

            </div>
        </div>
      </section>

        {/* FAQ Section */}
        <div id="faq">
      <FAQ />
        </div>
      </div>

      <Footer />
    </main>
  )
}
