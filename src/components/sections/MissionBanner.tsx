"use client"

import React from 'react'
import { GlassButton } from '@/components/ui/liquid-glass'

export function MissionBanner() {
  return (
    <section id="mission" className="relative w-full h-[60vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/assets/events_landing.png)',
          backgroundPosition: 'center 30%' // Shift upward to better frame the subject
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
          <p className="text-white text-lg md:text-xl font-light tracking-wide max-w-lg leading-relaxed text-balance antialiased drop-shadow-sm">
            Exclusive launches, styling sessions, and community gatherings.
          </p>
          
          <div className="mt-2">
            <GlassButton href="/events">
              <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">
                Be in the know
              </span>
            </GlassButton>
          </div>
        </div>
      </div>
    </section>
  )
}
