'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Lens } from '@/components/ui/magnifier-lens'

/**
 * JewelryBoxReveal - Static full-width version
 * "add your story to a vintage piece"
 */
export function JewelryBoxReveal() {
  return (
    <section className="relative w-full bg-[#F9F8F6]">
      {/* Top border line to separate from categories above if needed, or remove for seamless flow */}
      <div className="flex flex-col md:flex-row min-h-[85vh] w-full border-t border-white/0">
        {/* Image Side - Full Height */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-auto bg-[#F9F8F6] flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center p-8 md:p-12">
            <Lens zoomFactor={2.5} lensSize={200}>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/assets/tomi-jewel-box-trans.png"
                  alt="Vintage jewelry box"
                  width={1200}
                  height={1200}
                  className="w-full h-full object-contain scale-150"
                  priority
                />
              </div>
            </Lens>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-24 py-20 md:py-0 bg-[#F9F8F6]">
          <div className="max-w-xl">
            <span className="block mb-6 text-xs font-medium tracking-[0.2em] uppercase text-stone-500">
              One of a kind
            </span>
            <h2 className="font-heading text-4xl md:text-6xl mb-8 leading-[1.1] text-stone-900">
              add your story <br />
              <span className="italic text-stone-600">to a vintage piece</span>
            </h2>
            <p className="text-lg md:text-xl text-stone-600 mb-10 leading-relaxed font-light text-balance">
              Discover our curated collection of vintage heirlooms. Each piece carries a history, waiting for you to add the next chapter. From rare lockets to timeless gold chains, find something truly unique that speaks to you.
            </p>
            <div>
              <Link 
                href="/shop/category/one-of-a-kind-vintage"
                className="inline-flex items-center justify-center h-12 px-10 text-sm uppercase tracking-widest border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300"
              >
                shop vintage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
