import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function RecyclePage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12">
          <div className="container mx-auto max-w-3xl">
            
            <div className="bg-white p-8 md:p-16 border border-stone-100 shadow-sm text-center">
              <div className="flex justify-center mb-8">
                <span className="inline-block px-4 py-1.5 bg-[#efdada] text-stone-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                  Service Update
                </span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl text-stone-900 mb-6 leading-tight">
                Bring your pieces to the studio for recycling guidance.
              </h1>
              
              <p className="text-stone-600 text-lg font-light leading-relaxed mb-10 max-w-xl mx-auto">
                We assess gold and heirloom pieces in person so we can verify composition, explore refinishing, or talk through trade-in credit on the spot.
              </p>

              <div className="w-16 h-[1px] bg-primary mx-auto mb-10 opacity-20"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-12">
                <div className="bg-[#F9F8F6] p-6 rounded-sm">
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-primary mb-3">Visit Us</h3>
                  <p className="text-stone-600 font-light text-sm leading-relaxed">
                    Visit us with your jewelry and a valid ID so we can authenticate materials.
                  </p>
                </div>
                <div className="bg-[#F9F8F6] p-6 rounded-sm">
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-primary mb-3">Review Options</h3>
                  <p className="text-stone-600 font-light text-sm leading-relaxed">
                    Review options for trade-in value, recycling, or bespoke redesign while you’re here.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <p className="text-stone-500 text-sm font-light">
                  Questions about what qualifies?
                </p>
                <Link 
                  href="/contact" 
                  className="inline-block border-b border-stone-300 pb-1 text-xs font-bold uppercase tracking-[0.2em] text-stone-900 hover:border-primary hover:text-primary transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
