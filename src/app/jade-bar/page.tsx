import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const jadeProcessSteps = [
  {
    title: 'Select your jade',
    description: 'Explore shades that range from rich, traditional greens to milky whites, warm yellows, and lavender hues until you find the one that calls to you.',
    imageSrc: '/assets/select_your_jade.JPG',
    imageAlt: 'Selecting jade options at the bar',
  },
  {
    title: 'Choosing your chain',
    description: 'Bring your own chain for a small welding fee or opt for one of our satin cords or 14k solid gold chains to complement your jade donut.',
    imageSrc: '/assets/choosing_your_chain.jpg',
    imageAlt: 'Assorted chains and cords available for the jade bar',
  },
  {
    title: 'To bail or not to bail',
    description: 'Pick a white-gold or yellow-gold bail to hold your jade donut flat and add an extra glimmer, or keep it minimal and let the stone shine on its own.',
    imageSrc: '/assets/to_bail_not_bail.jpeg',
    imageAlt: 'Close-up of a jade donut pendant with a bail',
  },
  {
    title: 'Get excited, not jaded',
    description: "Your custom jade now heads to our jeweler with a turnaround time of roughly 2-3 weeks from creation. We'll notify you the moment it's ready for pick-up.",
    imageSrc: '/assets/not_jaded.png',
    imageAlt: 'Jeweler finishing touches on a custom jade piece',
  },
]

export default function JadeBarPage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-20 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/assets/jade%20bar%20hero.png" 
              alt="Tomi Jade Bar" 
              fill 
              className="object-cover"
              priority
              quality={95}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 px-6 md:px-12 container mx-auto w-full">
            <div className="max-w-3xl">
              <span className="block text-xs font-bold tracking-[0.2em] uppercase mb-4 text-white/90">
                Houston&apos;s First Customizable
              </span>
              <h1 className="font-heading text-7xl md:text-9xl text-white mb-6 leading-none">
                Jade Bar
              </h1>
              <div className="h-px w-24 bg-white/50 mb-8" />
              <p className="text-xl md:text-2xl font-light text-white/90 tracking-wide max-w-lg leading-relaxed">
                Curate your own heirloom. Choose your stone, your chain, and your story.
              </p>
            </div>
          </div>
        </section>

        {/* Why We Wear Jade - Editorial Grid */}
        <section className="py-24 bg-white border-b border-stone-100">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
               <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400">
                 Significance
               </span>
               <h2 className="font-heading text-3xl md:text-4xl text-stone-900 mt-3">
                 Why we wear jade
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 relative">
              
              {/* Item 1 */}
              <div className="flex flex-col items-center text-center md:px-12 group">
                <div className="w-16 h-16 rounded-full bg-[#efdada]/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" /></svg>
                </div>
                <h3 className="font-heading text-2xl text-stone-900 mb-2">For Protection</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed">
                  A talisman to ward off negativity and keep your spirit grounded.
                </p>
              </div>

              {/* Vertical Divider 1 */}
              <div className="hidden md:block absolute top-4 bottom-4 left-1/3 w-px bg-stone-100" />

              {/* Item 2 */}
              <div className="flex flex-col items-center text-center md:px-12 group">
                <div className="w-16 h-16 rounded-full bg-[#efdada]/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 21c4-3 7-6 7-10a7 7 0 10-14 0c0 4 3 7 7 10z" /></svg>
                </div>
                <h3 className="font-heading text-2xl text-stone-900 mb-2">For Health</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed">
                  Promoting balance, vitality, and emotional well-being.
                </p>
              </div>

              {/* Vertical Divider 2 */}
              <div className="hidden md:block absolute top-4 bottom-4 right-1/3 w-px bg-stone-100" />

              {/* Item 3 */}
              <div className="flex flex-col items-center text-center md:px-12 group">
                <div className="w-16 h-16 rounded-full bg-[#efdada]/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 17l-5 3 2-5-4-3 5-1 2-5 2 5 5 1-4 3 2 5-5-3z" /></svg>
                </div>
                <h3 className="font-heading text-2xl text-stone-900 mb-2">For Good Luck</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed">
                  To invite prosperity and open doors to new opportunities.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* The Process - Timeline */}
        <section className="py-24 md:py-32 bg-[#F9F8F6] overflow-hidden">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400 block mb-4">
                How it works
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-stone-900">
                The Jade Bar Experience
              </h2>
            </div>

            <div className="relative">
              {/* Central Line (Hidden on Mobile) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-300 -translate-x-1/2 hidden md:block" />

              <div className="space-y-20 md:space-y-32">
                {jadeProcessSteps.map((step, index) => {
                  const isEven = index % 2 === 0
                  return (
                    <div key={index} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      
                      {/* Timeline Dot (Center) */}
                      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full z-10 hidden md:block shadow-[0_0_0_8px_#F9F8F6]" />

                      {/* Image Side */}
                      <div className="w-full md:w-1/2 px-6 md:px-12 mb-8 md:mb-0">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200 shadow-md group">
                          <Image
                            src={step.imageSrc}
                            alt={step.imageAlt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>

                      {/* Text Side */}
                      <div className="w-full md:w-1/2 px-6 md:px-12 text-center md:text-left">
                        <div className={`flex flex-col ${isEven ? 'md:items-start' : 'md:items-end md:text-right'}`}>
                          <span className="text-6xl font-heading text-[#efdada] opacity-50 mb-2 leading-none">
                            0{index + 1}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-heading text-stone-900 mb-4">
                            {step.title}
                          </h3>
                          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-md">
                            {step.description}
                          </p>
                        </div>
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </section>

        {/* Sourcing & Grades */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-7xl">
            
            {/* Sourcing Intro */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400 block mb-4">
                  Our Sourcing
                </span>
                <h2 className="font-heading text-4xl md:text-5xl text-stone-900 mb-8">
                  Authentic. Ethical. <br /><span className="italic text-stone-500">Untreated.</span>
                </h2>
                <p className="text-lg text-stone-600 font-light leading-relaxed mb-8 text-balance">
                  At tomi, we believe jade should be celebrated in its purest form. We source directly from trusted suppliers in Myanmar (Burma) and select Asian regions. Every piece is hand-selected for natural beauty and durability.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-[#F9F8F6] text-stone-600 text-xs font-bold uppercase tracking-wider rounded-full">Myanmar (Burma)</span>
                  <span className="px-4 py-2 bg-[#F9F8F6] text-stone-600 text-xs font-bold uppercase tracking-wider rounded-full">Trusted Suppliers</span>
                </div>
              </div>
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden rounded-lg">
                 <Image
                    src="/assets/source_jade.png"
                    alt="Jade sourcing map"
                    fill
                    className="object-cover"
                 />
              </div>
            </div>

            {/* Grading Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Grade A */}
              <div className="bg-[#F9F8F6] p-8 border border-[#efdada] relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 bg-[#efdada] text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                  We Only Sell This
                </div>
                <h3 className="font-heading text-2xl text-stone-900 mb-4">Grade A</h3>
                <p className="text-stone-600 font-light leading-relaxed text-sm">
                  100% natural jadeite, untreated and free from dyes or resin. Just pure, authentic stone that lasts generations.
                </p>
              </div>

              {/* Grade B */}
              <div className="bg-white border border-stone-100 p-8 opacity-60 hover:opacity-100 transition-opacity">
                <h3 className="font-heading text-2xl text-stone-400 mb-4">Grade B</h3>
                <p className="text-stone-500 font-light leading-relaxed text-sm">
                  Chemically bleached and polymer-filled to improve color. Less durable and lower quality than natural jade.
                </p>
              </div>

              {/* Grade C */}
              <div className="bg-white border border-stone-100 p-8 opacity-60 hover:opacity-100 transition-opacity">
                <h3 className="font-heading text-2xl text-stone-400 mb-4">Grade C</h3>
                <p className="text-stone-500 font-light leading-relaxed text-sm">
                  Dyed to enhance color artificially. Over time, the color can fade and the stone loses its integrity.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#efdada] text-center px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-4xl md:text-5xl text-stone-900 mb-8">
              Ready to create your piece?
            </h2>
            <p className="text-lg text-stone-700 font-light mb-10">
              Visit us at our Houston studio to experience the Jade Bar in person.
            </p>
            <Link 
              href="/visit" 
              className="inline-flex items-center justify-center px-10 py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
            >
              Plan Your Visit
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
