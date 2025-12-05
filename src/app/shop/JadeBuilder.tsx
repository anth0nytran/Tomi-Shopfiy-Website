"use client"

import React, { useState } from 'react'
import { Check } from 'lucide-react'

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

export function JadeBuilder() {
  // Shared State
  const [jewelryType, setJewelryType] = useState<'necklace' | 'bracelet'>('necklace')
  
  // Option 1 State
  const [chain, setChain] = useState<string>('Adjustable Box')
  const [bailShape, setBailShape] = useState<string>('Round')
  const [bailMetal, setBailMetal] = useState<string>('Yellow Gold') // Default selection
  const [jadeColor, setJadeColor] = useState<string>('green')

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* --- Option 1: Quick Build (Left Column) --- */}
        <div className="w-full">
          <div className="mb-8">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-2">Option 1: Quick Build</h2>
            <p className="text-stone-500 font-light text-sm">Select your preferences and we'll choose a beautiful jade piece for you.</p>
          </div>

          {/* Type Tabs */}
          <div className="flex border-b border-stone-200 mb-10">
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

          <div className="space-y-10 animate-fade-in">
            
            {/* 1. Chain Style */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
                {jewelryType === 'necklace' ? 'Chain Style' : 'Bracelet Style'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(jewelryType === 'necklace' ? CHAIN_OPTIONS : BRACELET_OPTIONS).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setChain(opt)}
                    className={`px-4 py-4 text-sm border transition-all text-left ${
                      chain === opt 
                        ? 'border-[#efdada] bg-[#efdada] text-primary ring-1 ring-[#efdada]' 
                        : 'border-stone-200 text-stone-500 hover:border-stone-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Bail Selection (Only for Necklace) */}
            {jewelryType === 'necklace' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Bail Shape</h3>
                  <div className="flex gap-3">
                    {BAIL_SHAPES.map(shape => (
                      <button
                        key={shape}
                        onClick={() => setBailShape(shape)}
                        className={`flex-1 py-3 text-sm border transition-all ${
                          bailShape === shape 
                            ? 'border-[#efdada] bg-[#efdada] text-primary' 
                            : 'border-stone-200 text-stone-500 hover:border-stone-400'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Bail Metal</h3>
                  <div className="flex gap-3">
                    {BAIL_METALS.map(metal => (
                      <button
                        key={metal}
                        onClick={() => setBailMetal(metal)}
                        className={`flex-1 py-3 text-sm border transition-all ${
                          bailMetal === metal 
                            ? 'border-[#efdada] bg-[#efdada] text-primary' 
                            : 'border-stone-200 text-stone-500 hover:border-stone-400'
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
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Jade Color Preference</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {JADE_COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setJadeColor(color.value)}
                    className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none`}
                    title={color.label}
                    style={{ backgroundColor: color.color }}
                  >
                    {jadeColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full rounded-full border-2 border-white/50 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />
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
              <p className="text-xs text-stone-400 italic">Note: You select the color, we select the unique stone.</p>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-6">
              <button 
                className="w-full bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-[#efdada] hover:text-primary transition-colors disabled:opacity-90 disabled:cursor-not-allowed"
                disabled={true}
              >
                Add to Cart (Coming Soon)
              </button>
            </div>

          </div>
        </div>


        {/* --- Option 2: Custom Design (Right Column) --- */}
        <div className="w-full h-full flex flex-col">
          <div className="mb-8">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-2">Option 2: Custom Design</h2>
            <p className="text-stone-500 font-light text-sm">Fill out the form below to work directly with a store associate</p>
          </div>

          <div className="flex-1 bg-white p-8 md:p-12 shadow-sm border border-stone-100 h-full">
            <form className="space-y-8 h-full flex flex-col" onSubmit={(e) => e.preventDefault()}>
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-stone-200 py-2 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                  placeholder="Your Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-transparent border-b border-stone-200 py-2 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full bg-transparent border-b border-stone-200 py-2 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-2 flex-1 min-h-[100px]">
                 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">What are you looking for?</label>
                 <textarea 
                   className="w-full h-full min-h-[150px] bg-transparent border-b border-stone-200 py-2 text-primary focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-stone-300 leading-relaxed"
                   placeholder="Tell us about your dream jade piece..."
                 />
              </div>

              {/* Submit Button */}
              <div className="pt-4 mt-auto">
                <button 
                  className="w-full bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-[#efdada] hover:text-primary transition-colors"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
