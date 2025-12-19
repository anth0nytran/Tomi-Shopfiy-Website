"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Check, ArrowRight, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Data Constants ---

const JADE_COLORS = [
  { label: 'Green', value: 'green', color: '#879d91' },
  { label: 'Lavender', value: 'lavender', color: '#cec9d1' },
  { label: 'White', value: 'white', color: '#ffffff' },
  { label: 'Pink', value: 'pink', color: '#e6e3e4' },
  { label: 'Yellow', value: 'yellow', color: '#e1e0c8' },
  { label: 'Blue', value: 'blue', color: '#b0bbc4' },
  { label: 'Black', value: 'black', color: '#000000' },
]

const CHAIN_STYLES = [
  '14k Wheat',
  '14k Box',
  '14k Sparkle',
  '14k Dainty Cable',
  '9k Sparkle',
]

const CHAIN_METALS = ['Yellow Gold', 'White Gold']

const BAIL_SHAPES = ['Round', 'Oval', 'Mini Oval']
const BAIL_METALS = ['Yellow Gold', 'White Gold']

// --- Components ---

type ViewState = 'selection' | 'online-order' | 'consultation'

export function JadeBuilder() {
  const [view, setView] = useState<ViewState>('selection')

  // Shared State
  const [jewelryType, setJewelryType] = useState<'necklace' | 'bracelet'>('necklace')
  
  // Option 1 State
  const [chain, setChain] = useState<string>('14k Wheat')
  const [chainMetal, setChainMetal] = useState<string>('Yellow Gold')
  const [bailShape, setBailShape] = useState<string>('Round')
  const [bailMetal, setBailMetal] = useState<string>('Yellow Gold') 
  const [jadeColor, setJadeColor] = useState<string>('green')

  // Consultation form state
  const [consultFirstName, setConsultFirstName] = useState('')
  const [consultLastName, setConsultLastName] = useState('')
  const [consultEmail, setConsultEmail] = useState('')
  const [consultPhone, setConsultPhone] = useState('')
  const [consultDesiredDate, setConsultDesiredDate] = useState('')
  const [consultByoChain, setConsultByoChain] = useState('')
  const [consultNotes, setConsultNotes] = useState('')
  const [consultSubmitting, setConsultSubmitting] = useState(false)
  const [consultError, setConsultError] = useState<string | null>(null)
  const [consultSuccess, setConsultSuccess] = useState(false)

  function utmFromLocation() {
    if (typeof window === 'undefined') return {}
    const sp = new URLSearchParams(window.location.search)
    return {
      utmSource: sp.get('utm_source') || '',
      utmMedium: sp.get('utm_medium') || '',
      utmCampaign: sp.get('utm_campaign') || '',
      utmTerm: sp.get('utm_term') || '',
      utmContent: sp.get('utm_content') || '',
    }
  }

  async function submitConsultation(e: React.FormEvent) {
    e.preventDefault()
    if (consultSubmitting) return
    setConsultError(null)
    setConsultSuccess(false)
    setConsultSubmitting(true)

    try {
      const payload = {
        formType: 'jade_consultation',
        sourcePath: '/shop/jade-jewelry',
        sourceFlow: 'shop->jade-jewelry->consultation',
        ...utmFromLocation(),
        firstName: consultFirstName.trim(),
        lastName: consultLastName.trim(),
        email: consultEmail.trim(),
        phone: consultPhone.trim(),
        desiredDate: consultDesiredDate,
        jewelryType,
        chainStyle: chain,
        chainColor: chainMetal,
        bailShape,
        bailColor: bailMetal,
        byoChain: consultByoChain.trim(),
        notesOrMessage: consultNotes.trim(),
        // extra context (kept in rawPayloadJson)
        jadeColor,
      }

      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const out = await res.json().catch(() => ({}))
        throw new Error(out?.error || 'Failed to submit inquiry')
      }

      setConsultSuccess(true)
      setConsultNotes('')
    } catch (err: any) {
      setConsultError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setConsultSubmitting(false)
    }
  }

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
                    1. Choose Chain Style
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {CHAIN_STYLES.map((opt) => (
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

                {/* 2. Chain Metal */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-center">
                    2. Chain Metal
                  </h3>
                  <div className="flex gap-3 max-w-md mx-auto w-full">
                    {CHAIN_METALS.map((metal) => (
                      <button
                        key={metal}
                        onClick={() => setChainMetal(metal)}
                        className={`flex-1 py-3 text-sm border transition-all ${
                          chainMetal === metal 
                            ? 'border-[#efdada] bg-[#efdada] text-primary' 
                            : 'border-stone-100 text-stone-500 hover:border-primary/30'
                        }`}
                      >
                        {metal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Bail Selection (Only for Necklace) */}
                {jewelryType === 'necklace' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-center">3. Bail Shape</h3>
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
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-center">4. Bail Metal</h3>
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

                {/* 4. Jade Color Preference */}
                <div className="space-y-4 text-center">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                     {jewelryType === 'necklace' ? '5.' : '3.'} Jade Color Preference
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

              <form className="space-y-8" onSubmit={submitConsultation}>
                
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">First Name</label>
                    <input 
                      type="text" 
                      value={consultFirstName}
                      onChange={(e) => setConsultFirstName(e.target.value)}
                      className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Last Name</label>
                    <input 
                      type="text" 
                      value={consultLastName}
                      onChange={(e) => setConsultLastName(e.target.value)}
                      className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Phone</label>
                    <input 
                      type="tel" 
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                      placeholder="(555) 000-0000"
                    />
                  </div>

                  {/* Date Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Date</label>
                    <input 
                      type="date" 
                      value={consultDesiredDate}
                      onChange={(e) => setConsultDesiredDate(e.target.value)}
                      className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300 text-stone-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Email</label>
                  <input
                    type="email"
                    value={consultEmail}
                    onChange={(e) => setConsultEmail(e.target.value)}
                    className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                    placeholder="you@email.com"
                    required
                  />
                </div>

                {/* Chain Preference */}
                <div className="space-y-6 pt-4 border-t border-stone-100">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Chain Selection</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Chain Style */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Style</label>
                                <select
                                  value={chain}
                                  onChange={(e) => setChain(e.target.value)}
                                  className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none rounded-none"
                                >
                                    <option value="">Select Chain Style</option>
                                    {CHAIN_STYLES.map((style) => (
                                      <option key={style} value={style}>
                                        {style}
                                      </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Chain Color */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Color</label>
                                <div className="flex gap-4 pt-3">
                                    {CHAIN_METALS.map(option => (
                                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                              type="radio"
                                              name="chain_color"
                                              value={option}
                                              checked={chainMetal === option}
                                              onChange={() => setChainMetal(option)}
                                              className="w-4 h-4 text-primary focus:ring-primary border-stone-300 accent-primary"
                                            />
                                            <span className="text-sm text-stone-600 group-hover:text-primary transition-colors">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bail Preference */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Bail Selection</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bail Shape */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Shape</label>
                                <div className="flex flex-wrap gap-4 pt-3">
                                    {BAIL_SHAPES.map(option => (
                                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                              type="radio"
                                              name="bail_shape"
                                              value={option}
                                              checked={bailShape === option}
                                              onChange={() => setBailShape(option)}
                                              className="w-4 h-4 text-primary focus:ring-primary border-stone-300 accent-primary"
                                            />
                                            <span className="text-sm text-stone-600 group-hover:text-primary transition-colors">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Bail Color */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Color</label>
                                <div className="flex gap-4 pt-3">
                                    {BAIL_METALS.map(option => (
                                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                              type="radio"
                                              name="bail_color"
                                              value={option}
                                              checked={bailMetal === option}
                                              onChange={() => setBailMetal(option)}
                                              className="w-4 h-4 text-primary focus:ring-primary border-stone-300 accent-primary"
                                            />
                                            <span className="text-sm text-stone-600 group-hover:text-primary transition-colors">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BYO Chain */}
                <div className="space-y-2 pt-4 border-t border-stone-100">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">BYO Chain</label>
                   <input 
                     type="text" 
                     value={consultByoChain}
                     onChange={(e) => setConsultByoChain(e.target.value)}
                     className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300"
                     placeholder="Type of chain & color"
                   />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Notes</label>
                   <textarea 
                     value={consultNotes}
                     onChange={(e) => setConsultNotes(e.target.value)}
                     className="w-full min-h-[150px] bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-stone-300 leading-relaxed"
                     placeholder="Be as specific as possible..."
                   />
                </div>

                {consultError && <div className="text-sm text-red-700">{consultError}</div>}
                {consultSuccess && <div className="text-sm text-green-700">Thanks — we received your inquiry.</div>}

                {/* Submit Button */}
                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={consultSubmitting}
                    className="w-full bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl"
                  >
                    {consultSubmitting ? 'Submitting…' : 'Submit Inquiry'}
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
