import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ShippingPage() {
  return (
    <main className="bg-[#F9F8F6] flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12">
          <div className="container mx-auto max-w-4xl">
            
            <div className="text-center mb-16">
              <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                Customer Care
              </span>
              <h1 className="font-heading text-4xl md:text-6xl text-stone-900 mb-6 leading-tight">
                Shipping &amp; Returns
              </h1>
              <p className="text-stone-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                Shipping options, delivery times, and our return policy.
              </p>
            </div>

            <div className="bg-white border border-stone-100 shadow-sm p-8 md:p-12 max-w-3xl mx-auto space-y-12">
              
              {/* Shipping Section */}
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-6 mb-8">
                  <h2 className="font-heading text-2xl text-stone-900">Shipping Options &amp; Delivery Times</h2>
                </div>

                <div className="space-y-10">
                  {/* US */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">United States</h3>
                    <div className="bg-stone-50 p-6 rounded-sm space-y-6">
                      <div className="grid md:grid-cols-2 gap-4 border-b border-stone-200 pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-stone-800">Standard</p>
                          <p className="text-xs text-stone-500 italic">3 to 4 business days</p>
                          <p className="text-xs text-stone-500 mt-1">Texas residents may experience faster delivery times.</p>
                        </div>
                        <div className="text-right md:text-left">
                          <p className="text-stone-700">UPS Ground ($11-14+)</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-bold text-stone-800">Express</p>
                          <p className="text-xs text-stone-500 italic">1 to 2 business days</p>
                        </div>
                        <div className="text-right md:text-left">
                          <p className="text-stone-700">UPS Next Day Air ($25-50+)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Canada */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">Canada</h3>
                    <div className="bg-stone-50 p-6 rounded-sm space-y-6">
                      <div className="grid md:grid-cols-2 gap-4 border-b border-stone-200 pb-4">
                        <div>
                          <p className="font-bold text-stone-800">Standard International</p>
                          <p className="text-xs text-stone-500 italic">2 to 3 business days</p>
                        </div>
                        <div className="text-right md:text-left space-y-1">
                          <p className="text-stone-700">UPS Standard ($20+)</p>
                          <p className="text-stone-700">UPS Worldwide Expedited ($30+)</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-bold text-stone-800">Express International</p>
                          <p className="text-xs text-stone-500 italic">1 to 2 business days</p>
                        </div>
                        <div className="text-right md:text-left">
                          <p className="text-stone-700">UPS Worldwide Saver ($34+)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* International */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">International</h3>
                    <p className="text-xs text-stone-500 mb-4">Shipping rates may vary based on destination country.</p>
                    <div className="bg-stone-50 p-6 rounded-sm space-y-6">
                      <div className="grid md:grid-cols-2 gap-4 border-b border-stone-200 pb-4">
                        <div>
                          <p className="font-bold text-stone-800">Standard International</p>
                          <p className="text-xs text-stone-500 italic">6 to 12 business days</p>
                        </div>
                        <div className="text-right md:text-left">
                          <p className="text-stone-700">UPS Worldwide Expedited</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-bold text-stone-800">Express International</p>
                          <p className="text-xs text-stone-500 italic">1 to 5 business days</p>
                        </div>
                        <div className="text-right md:text-left">
                          <p className="text-stone-700">UPS Worldwide Express</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Returns Section */}
              <div className="pt-8 border-t border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl text-stone-900">Return Policy</h2>
                </div>
                
                <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                  <div className="flex gap-4">
                     <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-stone-300 mt-2.5"></span>
                     <p>Full refund available within <strong>30 days</strong> of purchase.</p>
                  </div>
                  <div className="flex gap-4">
                     <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-stone-300 mt-2.5"></span>
                     <p>After 30 days, customers are eligible for <strong>store credit only</strong>.</p>
                  </div>
                  <div className="flex gap-4">
                     <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-stone-300 mt-2.5"></span>
                     <p>After 45 days, no returns, refunds, or exchanges will be accepted.</p>
                  </div>
                </div>
              </div>

              {/* Support Section */}
              <div className="pt-8 border-t border-stone-100 text-center">
                <p className="text-stone-500 text-sm font-light mb-4">
                  Having trouble? Contact our Support team:
                </p>
                <a 
                  href="mailto:support@tomijewelry.com" 
                  className="text-stone-900 font-bold border-b border-stone-900 hover:text-stone-600 hover:border-stone-600 transition-colors"
                >
                  support@tomijewelry.com
                </a>
              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}






