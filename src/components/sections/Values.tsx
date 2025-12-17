import React from 'react'
import Image from 'next/image'

export function Values() {
  return (
    <section id="values" className="py-20 md:py-32 bg-[#F9F8F6] w-full">
      <div className="container mx-auto px-6 md:px-12 mb-16 md:mb-24 text-center">
        <h3 className="font-heading text-4xl md:text-6xl text-stone-900 leading-[1.1] max-w-4xl mx-auto mb-6">
          Affordable Luxury
        </h3>
        <p className="text-stone-600 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed text-balance">
          Because you deserve solid gold without the high markup. Mindfully crafted for your everyday, designed to last a lifetime.
        </p>
      </div>

      <div className="w-full px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 relative">
          {/* Minimal dividers - decorative vertical lines only on md+ screens */}
          <div className="hidden md:block absolute top-8 bottom-8 left-1/3 w-[1px] bg-stone-200"></div>
          <div className="hidden md:block absolute top-8 bottom-8 right-1/3 w-[1px] bg-stone-200"></div>

          <div className="flex flex-col items-center text-center group">
            <div className="mb-8 relative w-14 h-14 flex items-center justify-center opacity-90 transition-transform duration-500 group-hover:scale-110">
              <Image src="/assets/gem icon background removed.png" alt="Gem icon" width={56} height={56} className="object-contain" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-stone-900">Solid Gold</h4>
            <p className="text-stone-500 leading-relaxed font-light text-sm md:text-base max-w-[260px]">
              Real gold that never oxidizes or discolors. Wear it in the shower, sleep in it, live in it.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="mb-8 relative w-14 h-14 flex items-center justify-center opacity-90 transition-transform duration-500 group-hover:scale-110">
              <Image src="/assets/repair icon Background Removed.png" alt="Repair icon" width={56} height={56} className="object-contain" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-stone-900">Lifetime Warranty</h4>
            <p className="text-stone-500 leading-relaxed font-light text-sm md:text-base max-w-[260px]">
              We stand by our quality. If anything happens to your piece, we will repair or replace it.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="mb-8 relative w-14 h-14 flex items-center justify-center opacity-90 transition-transform duration-500 group-hover:scale-110">
              <Image src="/assets/locket icon Background Removed.png" alt="Gem icon" width={56} height={56} className="object-contain" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-stone-900">Timeless Design</h4>
            <p className="text-stone-500 leading-relaxed font-light text-sm md:text-base max-w-[260px]">
              Focusing on enduring style over fleeting microtrends. Jewelry meant to be passed down.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
