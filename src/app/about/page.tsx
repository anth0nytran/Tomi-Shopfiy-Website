import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        {/* Hero / Intro Statement */}
        <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 px-6 bg-[#F9F8F6]">
          <div className="container mx-auto max-w-4xl text-center">
            <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
              Our Mission
            </span>
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl text-stone-900 leading-[1.15] mb-4">
              We believe in <span className="italic font-light text-stone-500">affordable</span> gold jewelry, 
              <br className="hidden md:block" />
              and we are making it happen in Houston.
            </h1>
        </div>
      </section>

        {/* Featured Image - Editorial Style */}
        <section className="w-full px-6 md:px-12 pb-20 bg-[#F9F8F6]">
          <div className="relative w-full max-w-[1400px] mx-auto aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-stone-100">
          <Image
            src="/assets/about%20us.jpg"
            alt="Inside Tomi studio — craftsmanship and gold jewelry"
            fill
              className="object-cover"
            priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              quality={95}
          />
        </div>
      </section>

        {/* Story Content */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start justify-between max-w-5xl mx-auto">
              <div className="w-full md:w-1/3 md:sticky md:top-32">
                <h3 className="font-heading text-3xl md:text-4xl text-stone-900 mb-6">
                  Timeless &amp; Attainable
                </h3>
                <div className="h-[1px] w-12 bg-stone-300" />
          </div>

              <div className="w-full md:w-2/3 text-base md:text-lg text-stone-600 font-light leading-relaxed space-y-8 text-balance">
                <p>
                  At tomi, we believe that fine jewelry should be both timeless and attainable. 
                  Our mission is to create gold jewelry that honors sustainable practices, 
                  responsible sourcing, and craftsmanship that lasts for generations—all at an 
                  accessible price point.
                </p>
                <p>
                  We do not chase fast-moving trends. Instead, we design pieces that are unique, 
                  versatile, and meant to become part of your personal story—treasures you will 
                  cherish today and pass on tomorrow. Each piece is thoughtfully crafted with 
                  care for the planet, using responsibly sourced materials and ethical production methods.
                </p>
                <p>
                  By rethinking what luxury means, we make quality gold jewelry available without 
                  the traditional markups. The result? Jewelry that is affordable, meaningful, 
                  and enduring—made to shine for this generation and the next.
                </p>
                
                <div className="pt-12">
                  <p className="font-heading text-2xl md:text-3xl text-stone-800 italic">
                    &ldquo;today&apos;s gem, tomorrow&apos;s gift&rdquo;
                  </p>
                </div>
              </div>
            </div>
        </div>
      </section>

        {/* CTA Section - Matching MissionBanner vibe but lighter */}
        <section className="relative py-24 bg-[#F9F8F6] text-center">
          <div className="container mx-auto px-6">
            <h2 className="font-heading text-4xl md:text-5xl text-stone-900 mb-8">
              See it. Feel it. Love it.
            </h2>
            <Link 
              href="/visit" 
              className="inline-flex items-center justify-center px-10 py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
            >
              Visit Us
            </Link>
        </div>
      </section>
      </div>

      <Footer />
    </main>
  )
}
