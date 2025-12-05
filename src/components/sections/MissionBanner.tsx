import React from 'react'
import Link from 'next/link'

export function MissionBanner() {
  return (
    <section id="mission" className="relative w-full h-[60vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/assets/events_landing.png)',
          backgroundPosition: 'center 40%' // Shift slightly up to frame the scene better
        }}
      />
      
      {/* Sophisticated Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content - Centered for better balance */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none drop-shadow-md">
          events at <span className="italic">tomi</span>
        </h2>
        
        <div className="flex flex-col items-center gap-8">
          <p className="text-white/95 text-lg md:text-xl font-light tracking-wide max-w-lg leading-relaxed text-balance antialiased drop-shadow-sm">
            Exclusive launches, styling sessions, and community gatherings.
          </p>
          
          <Link 
            href="/events" 
            className="group flex items-center gap-3 text-white text-xs font-bold uppercase tracking-[0.25em] hover:text-white/90 transition-colors mt-2"
          >
            <span>Be in the know</span>
            <span className="text-lg leading-none transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
