"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Check, ArrowRight, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Data Constants ---

const JADE_COLORS = [
  { label: 'Green', value: 'green', color: '#15803d' }, // Deeper green
  { label: 'Purple', value: 'purple', color: '#a855f7' }, // Brighter purple
  { label: 'Black', value: 'black', color: '#1c1917' },
  { label: 'Blue', value: 'blue', color: '#0ea5e9' }, // Cyan/Blue
  { label: 'Yellow', value: 'yellow', color: '#facc15' }, // Bright yellow
  { label: 'Pink', value: 'pink', color: '#f472b6' }, // Rose pink
]

const CHAIN_OPTIONS = [
  'Adjustable Box',
  'Satin Cord',
  'Adjustable Cable',
]

const BRACELET_OPTIONS = [
  'Adjustable Wheat',
  'Adjustable Dainty Cable',
  'Adjustable Sparkle',
]

const BAIL_SHAPES = ['Round', 'Oval']
const BAIL_METALS = ['White Gold', 'Yellow Gold']

// --- Components ---

type ViewState = 'selection' | 'online-order' | 'consultation'

export function JadeBuilder() {
  const [view, setView] = useState<ViewState>('selection')

  // Shared State
  const [jewelryType, setJewelryType] = useState<'necklace' | 'bracelet'>('necklace')
  
  // Option 1 State
  const [chain, setChain] = useState<string>('Adjustable Box')
  const [bailShape, setBailShape] = useState<string>('Round')
  const [bailMetal, setBailMetal] = useState<string>('Yellow Gold') 
  const [jadeColor, setJadeColor] = useState<string>('green')

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto min-h-[600px]">
      <AnimatePresence mode="wait">
        
        {/* --- Selection View --- */}
        {view === 'selection' && (
          <motion.div
            key="selection"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center py-10"
          >
            <div className="text-center mb-16 max-w-2xl">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400 block mb-4">
                Choose Your Experience
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6">
                How would you like to build your jade piece?
              </h2>
              <p className="text-stone-600 font-light text-lg">
                Whether you know exactly what you want or need a little guidance, we have a path for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
              
              {/* Card 1: Online Order */}
              <button 
                onClick={() => setView('online-order')}
                className="group relative flex flex-col bg-white border border-stone-200 hover:border-primary/30 hover:shadow-xl transition-all duration-500 overflow-hidden text-left h-[500px]"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-stone-100 group-hover:bg-primary transition-colors duration-500" />
                
                <div className="relative h-64 w-full overflow-hidden bg-stone-50">
                   {/* Placeholder for visual - using simple color block or abstract pattern if no specific image fits perfectly yet */}
                   <div className="absolute inset-0 bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                      <Sparkles className="w-16 h-16 text-stone-200 group-hover:text-primary/20 transition-colors" />
                   </div>
                   <Image 
                      src="/assets/choosing_your_chain.jpg" 
                      alt="Jade materials" 
                      fill 
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                    />
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-8 h-8 rounded-full bg-[#efdada] flex items-center justify-center text-primary text-xs font-bold">01</span>
                     <h3 className="font-heading text-2xl text-stone-900">Online Order</h3>
                  </div>
                  
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    Perfect if you trust our styling. Select your preferences (color, metal, chain) and we will hand-pick a beautiful jade piece that matches your vibe.
                  </p>

                  <div className="mt-auto flex items-center text-primary text-xs font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                    Start Order <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </button>

              {/* Card 2: Consultation */}
              <button 
                onClick={() => setView('consultation')}
                className="group relative flex flex-col bg-white border border-stone-200 hover:border-primary/30 hover:shadow-xl transition-all duration-500 overflow-hidden text-left h-[500px]"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-stone-100 group-hover:bg-primary transition-colors duration-500" />
                
                <div className="relative h-64 w-full overflow-hidden bg-stone-50">
                    <div className="absolute inset-0 bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                      <MessageSquare className="w-16 h-16 text-stone-200 group-hover:text-primary/20 transition-colors" />
                   </div>
                   <Image 
                      src="/assets/select_your_jade.JPG" 
                      alt="Consultation" 
                      fill 
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                    />
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-8 h-8 rounded-full bg-[#efdada] flex items-center justify-center text-primary text-xs font-bold">02</span>
                     <h3 className="font-heading text-2xl text-stone-900">Consultation</h3>
                  </div>
                  
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    Work one-on-one with our team. Sourcing specific stones, custom carvings, or unique settings? Let&apos;s discuss your vision directly.
                  </p>

                  <div className="mt-auto flex items-center text-primary text-xs font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                    Start Consultation <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </button>

            </div>
          </motion.div>
        )}

        {/* --- Online Order View --- */}
        {view === 'online-order' && (
          <motion.div
            key="online-order"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl mx-auto"
          >
            <button 
              onClick={() => setView('selection')}
              className="group flex items-center text-stone-400 hover:text-primary transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Selection
            </button>

            <div className="bg-white p-8 md:p-12 border border-stone-100 shadow-sm">
              <div className="mb-10 text-center">
                <h2 className="font-heading text-3xl md:text-4xl text-primary mb-3">Online Order</h2>
                <p className="text-stone-500 font-light">Tell us what you love, and we&apos;ll find the perfect match.</p>
              </div>

              {/* Type Tabs */}
              <div className="flex justify-center border-b border-stone-200 mb-12">
                <div className="flex w-full max-w-md">
                    <button
                    onClick={() => setJewelryType('necklace')}
                    className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
                        jewelryType === 'necklace' ? 'border-primary text-primary' : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                    >
                    Necklace
                    </button>
                    <button
                    onClick={() => setJewelryType('bracelet')}
                    className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
                        jewelryType === 'bracelet' ? 'border-primary text-primary' : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                    >
                    Bracelet
                    </button>
                </div>
              </div>

              <div className="space-y-12 max-w-2xl mx-auto">
                
                {/* 1. Chain Style */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-center">
                    1. Choose {jewelryType === 'necklace' ? 'Chain' : 'Bracelet'} Style
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(jewelryType === 'necklace' ? CHAIN_OPTIONS : BRACELET_OPTIONS).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setChain(opt)}
                        className={`px-4 py-4 text-sm border transition-all text-center ${
                          chain === opt 
                            ? 'border-[#efdada] bg-[#efdada] text-primary ring-1 ring-[#efdada]' 
                            : 'border-stone-100 text-stone-500 hover:border-primary/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Bail Selection (Only for Necklace) */}
                {jewelryType === 'necklace' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-center">2. Bail Shape</h3>
                      <div className="flex gap-3">
                        {BAIL_SHAPES.map(shape => (
                          <button
                            key={shape}
                            onClick={() => setBailShape(shape)}
                            className={`flex-1 py-3 text-sm border transition-all ${
                              bailShape === shape 
                                ? 'border-[#efdada] bg-[#efdada] text-primary' 
                                : 'border-stone-100 text-stone-500 hover:border-primary/30'
                            }`}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-center">3. Bail Metal</h3>
                      <div className="flex gap-3">
                        {BAIL_METALS.map(metal => (
                          <button
                            key={metal}
                            onClick={() => setBailMetal(metal)}
                            className={`flex-1 py-3 text-sm border transition-all ${
                              bailMetal === metal 
                                ? 'border-[#efdada] bg-[#efdada] text-primary' 
                                : 'border-stone-100 text-stone-500 hover:border-primary/30'
                            }`}
                          >
                            {metal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Jade Color Preference */}
                <div className="space-y-4 text-center">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                     {jewelryType === 'necklace' ? '4.' : '2.'} Jade Color Preference
                  </h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {JADE_COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setJadeColor(color.value)}
                        className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none`}
                        title={color.label}
                        style={{ backgroundColor: color.color }}
                      >
                        {jadeColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full rounded-full border-2 border-white/50 flex items-center justify-center">
                              <Check className="w-6 h-6 text-white drop-shadow-md" strokeWidth={3} />
                            </div>
                          </div>
                        )}
                        {/* Ring indicator for selection clarity */}
                        {jadeColor === color.value && (
                          <div className="absolute -inset-1 rounded-full border border-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-400 italic mt-2">Note: You select the color, we select the unique stone.</p>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-8 border-t border-stone-100">
                  <button 
                    className="w-full bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-stone-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    disabled={true}
                  >
                    Add to Cart (Coming Soon)
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}


        {/* --- Consultation View --- */}
        {view === 'consultation' && (
          <motion.div
            key="consultation"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl mx-auto"
          >
             <button 
              onClick={() => setView('selection')}
              className="group flex items-center text-stone-400 hover:text-primary transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Selection
            </button>

            <div className="bg-white p-8 md:p-16 shadow-sm border border-stone-100">
              <div className="mb-10 text-center">
                <h2 className="font-heading text-3xl md:text-4xl text-primary mb-3">Consultation</h2>
                <p className="text-stone-500 font-light">Fill out the form below to work directly with a store associate.</p>
              </div>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                    placeholder="Your Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>

                {/* Text Area */}
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">What are you looking for?</label>
                   <textarea 
                     className="w-full min-h-[150px] bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-stone-300 leading-relaxed"
                     placeholder="Tell us about your dream jade piece..."
                   />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button 
                    className="w-full bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
