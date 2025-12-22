import React from 'react'
import Image from 'next/image'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function VisitPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const source = typeof searchParams?.source === 'string' ? searchParams.source : 'visit'
  const contactHref = `/contact?intent=appointment&source=${encodeURIComponent(source)}`

  return (
    <main className="bg-white flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        {/* Split Hero Section */}
        <section className="relative w-full min-h-[90vh] pt-24 md:pt-0 flex flex-col md:flex-row">
          {/* Image Side (Top on mobile, Left on desktop) */}
          <div className="relative w-full md:w-1/2 h-[50vh] md:h-auto bg-stone-100">
        <Image
          src="/assets/visit us.png"
          alt="Tomi Jewelry showroom"
          fill
          className="object-cover"
          priority
          quality={100}
          sizes="(max-width: 768px) 200vw, 100vw"
        />
          </div>

          {/* Info Side */}
          <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 md:p-20 lg:p-24">
            <div className="max-w-md mx-auto md:mx-0">
              <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                Our Showroom
              </span>
              
              <h1 className="font-heading text-4xl md:text-6xl text-stone-900 mb-8 leading-none">
                Visit Us
              </h1>

              <div className="space-y-12">
                {/* Address */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">
                    Location
                  </h3>
                  <p className="text-stone-600 text-lg font-light leading-relaxed">
                    2810 Riverby Rd. STE 104<br />
                    Houston, Texas 77020
                  </p>
                  <a 
                    href="https://maps.google.com/?q=2810+Riverby+Rd+Suite+104,+Houston,+TX+77020" 
                    target="_blank" 
                    rel="noopener"
                    className="inline-block mt-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-900 border-b border-stone-900 pb-1 hover:opacity-70 transition-opacity"
                  >
                    Get Directions
                  </a>
                </div>

                {/* Hours */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">
                    Opening Hours
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-stone-600 font-light text-base">
                    <div className="flex justify-between"><span>Mon - Thu</span></div>
                    <div>12pm – 7pm</div>
                    
                    <div className="flex justify-between"><span>Fri - Sat</span></div>
                    <div>11am – 7pm</div>
                    
                    <div className="flex justify-between"><span>Sunday</span></div>
                    <div>11am – 6pm</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  <Link 
                    href={contactHref}
                    className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </section>

        {/* Map Section */}
        <section className="w-full h-[50vh] md:h-[60vh] relative bg-stone-100">
            <iframe
              title="Tomi on Google Maps"
            className="w-full h-full filter grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              src="https://www.google.com/maps?q=2810+Riverby+Rd+Suite+104,+Houston,+TX+77020&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
        </section>
        </div>

      <Footer />
    </main>
  )
}
