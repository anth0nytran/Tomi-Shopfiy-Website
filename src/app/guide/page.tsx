import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      <AnnouncementBar />
      <Header />

      <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
            
            {/* Left Side: Stacked Logo / Brand Element */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-end md:sticky md:top-40">
              <div className="relative w-48 h-64 md:w-64 md:h-80 opacity-20">
                 {/* Stacked Tomi Logo Placeholder - using text if SVG not suitable or available, 
                     but user mentioned 'stacked tomi logo' specifically. 
                     Assuming /assets/tomi_stacked logo.svg exists based on recent files list */}
                 <Image 
                   src="/assets/tomi_stacked logo.svg"
                   alt="Tomi Jewelry"
                   fill
                   className="object-contain"
                 />
              </div>
            </div>

            {/* Right Side: Care Guide Content */}
            <div className="w-full md:w-2/3 max-w-2xl">
              <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                Care Guide
              </span>
              <h1 className="font-heading text-4xl md:text-5xl text-stone-900 mb-8 leading-tight">
                Jewelry Care
              </h1>
              
              <p className="text-stone-600 text-lg font-light leading-relaxed mb-12 text-balance">
                Your jewelry is made with real solid gold. It's made to last and designed for everyday wear, but requires a little love to stay looking brand new.
              </p>

              <div className="space-y-10">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-primary mb-4 border-b border-stone-200 pb-2 inline-block">
                    Our Tips
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex gap-4 items-start group">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#efdada] text-stone-900 font-bold text-[10px] mt-0.5">1</span>
                      <div className="text-stone-600 font-light leading-relaxed">
                        <strong className="font-medium text-stone-900 block mb-1">Clean Gently</strong>
                        Soak in warm water + dish soap, gently brush with a soft toothbrush, and pat dry with a soft cloth.
                      </div>
                    </li>
                    
                    <li className="flex gap-4 items-start group">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#efdada] text-stone-900 font-bold text-[10px] mt-0.5">2</span>
                      <div className="text-stone-600 font-light leading-relaxed">
                        <strong className="font-medium text-stone-900 block mb-1">Wear Often</strong>
                        Solid gold loves to be worn. Your skin's natural oils can actually help keep it shiny.
                      </div>
                    </li>

                    <li className="flex gap-4 items-start group">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#efdada] text-stone-900 font-bold text-[10px] mt-0.5">3</span>
                      <div className="text-stone-600 font-light leading-relaxed">
                        <strong className="font-medium text-stone-900 block mb-1">Store Safely</strong>
                        Store in a dry pouch or box to prevent scratches and tangles.
                      </div>
                    </li>

                    <li className="flex gap-4 items-start group">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#efdada] text-stone-900 font-bold text-[10px] mt-0.5">4</span>
                      <div className="text-stone-600 font-light leading-relaxed">
                        <strong className="font-medium text-stone-900 block mb-1">Avoid Harsh Chemicals</strong>
                        Avoid prolonged exposure to salt water, chlorine, and harsh chemicals (e.g., heavy perfumes or lotions).
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
