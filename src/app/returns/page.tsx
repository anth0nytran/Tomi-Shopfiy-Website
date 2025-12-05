import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      <AnnouncementBar />
      <Header />

      <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12">
        <div className="container mx-auto max-w-4xl">
          
          <div className="text-center mb-16">
            <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
              Customer Care
            </span>
            <h1 className="font-heading text-4xl md:text-6xl text-stone-900 mb-6 leading-tight">
              Returns &amp; Exchanges
            </h1>
            <p className="text-stone-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
              We stand behind every product that we sell. If you aren't 100% satisfied, we’re here to help make the process as painless as possible.
            </p>
          </div>

          <div className="bg-white border border-stone-100 shadow-sm p-8 md:p-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-6 mb-8">
              <h2 className="font-heading text-2xl text-stone-900">Policy Overview</h2>
              <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Updated 2024
              </span>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#efdada] text-stone-900 font-bold text-xs">1</span>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Refund Window</h3>
                  <p className="text-stone-600 font-light leading-relaxed">
                    We offer a <strong>30-day window</strong> for a full refund to your original payment method, and a <strong>45-day window</strong> for store credit exchanges.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#efdada] text-stone-900 font-bold text-xs">2</span>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Condition</h3>
                  <p className="text-stone-600 font-light leading-relaxed">
                    Jewelry must be returned in its original condition without any signs of wear or damage, and must include proof of purchase.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#efdada] text-stone-900 font-bold text-xs">3</span>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Exceptions</h3>
                  <p className="text-stone-600 font-light leading-relaxed">
                    For hygiene reasons, earrings used during a piercing appointment cannot be returned. Custom pieces are final sale.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-stone-100 text-center">
              <p className="text-stone-500 text-sm font-light mb-4">
                Ready to start a return?
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-stone-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
