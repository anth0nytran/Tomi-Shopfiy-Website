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

type ViewState = 'selection' | 'online-order' | 'consultation-choice' | 'consultation-familiar' | 'consultation-guidance'
type ConsultationProfile = 'Familiar' | 'Guidance' | ''

export function JadeBuilder() {
  const [view, setView] = useState<ViewState>('selection')
  const [consultationProfile, setConsultationProfile] = useState<ConsultationProfile>('')

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
      const basePayload: any = {
        formType: 'jade_consultation',
        sourcePath: '/shop/jade-jewelry',
        sourceFlow:
          consultationProfile === 'Familiar'
            ? 'shop->jade-jewelry->consultation->familiar'
            : consultationProfile === 'Guidance'
              ? 'shop->jade-jewelry->consultation->guidance'
              : 'shop->jade-jewelry->consultation',
        ...utmFromLocation(),
        firstName: consultFirstName.trim(),
        lastName: consultLastName.trim(),
        email: consultEmail.trim(),
        phone: consultPhone.trim(),
        consultationProfile,
        notesOrMessage: consultNotes.trim(),
        // extra context (kept in rawPayloadJson)
        jadeColor,
      }

      // Only include customization fields if the user picked the Familiar path.
      // For Guidance, leave those sheet columns blank (per your request).
      const payload =
        consultationProfile === 'Familiar'
          ? {
              ...basePayload,
              desiredDate: consultDesiredDate,
              jewelryType,
              chainStyle: chain,
              chainColor: chainMetal,
              bailShape,
              bailColor: bailMetal,
              byoChain: consultByoChain.trim(),
            }
          : basePayload

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
              
              {/* Card 1: Online Order (Disabled / Coming Soon) */}
              <div 
                className="group relative flex flex-col bg-white border border-stone-200 overflow-hidden text-left h-[500px] cursor-not-allowed select-none"
              >
                {/* Subtle overlay only on hover to indicate disabled state */}
                <div className="absolute inset-0 z-20 bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-stone-900 text-white px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Coming Soon
                  </span>
                </div>

                <div className="absolute top-0 left-0 w-full h-2 bg-stone-100" />
                
                <div className="relative h-64 w-full overflow-hidden bg-stone-50 group-hover:grayscale transition-all duration-500">
                   <div className="absolute inset-0 bg-white flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-stone-200" />
                   </div>
                   <Image 
                      src="/assets/choosing_your_chain.jpg" 
                      alt="Jade materials" 
                      fill 
                      className="object-cover opacity-80" 
                    />
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-1 group-hover:opacity-60 transition-opacity duration-300">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-8 h-8 rounded-full bg-[#efdada] flex items-center justify-center text-primary text-xs font-bold">01</span>
                     <h3 className="font-heading text-2xl text-stone-900">Online Order</h3>
                  </div>
                  
                  <p className="text-stone-500 font-light leading-relaxed mb-6">
                    Perfect if you trust our styling. Select your preferences (color, metal, chain) and we will hand-pick a beautiful jade piece that matches your vibe.
                  </p>

                  <div className="mt-auto flex items-center text-stone-400 text-xs font-bold uppercase tracking-[0.2em]">
                    Start Order <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>

              {/* Card 2: Consultation */}
              <button 
                onClick={() => setView('consultation-choice')}
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


        {/* --- Consultation Choice View --- */}
        {view === 'consultation-choice' && (
          <motion.div
            key="consultation-choice"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center py-10"
          >
            <button 
              onClick={() => setView('selection')}
              className="group flex items-center text-stone-400 hover:text-primary transition-colors mb-8 text-xs font-bold uppercase tracking-widest self-start md:self-center md:-ml-[800px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <div className="text-center mb-12 max-w-2xl">
              <h2 className="font-heading text-3xl md:text-4xl text-primary mb-6">
                Continue with the profile that best describes you:
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
              
              {/* Profile 1: Familiar */}
              <button 
                onClick={() => {
                  setConsultationProfile('Familiar')
                  setView('consultation-familiar')
                }}
                className="group relative flex flex-col bg-white border border-stone-200 hover:border-primary/30 hover:shadow-xl transition-all duration-500 overflow-hidden text-left min-h-[400px]"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-stone-100 group-hover:bg-primary transition-colors duration-500" />
                
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="w-8 h-8 rounded-full bg-[#efdada] flex items-center justify-center text-primary text-xs font-bold">A</span>
                  </div>
                  
                  <p className="text-stone-600 font-light leading-relaxed mb-6 text-lg">
                    &ldquo;I am familiar with the Jade Bar customizations (i.e., I know what chains are offered, and I know if I want a bail or not) and would like the additional assistance of a store team member to order my jade.&rdquo;
                  </p>

                  <div className="mt-auto flex items-center text-primary text-xs font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                    Select Profile <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </button>

              {/* Profile 2: Guidance */}
              <button 
                onClick={() => {
                  setConsultationProfile('Guidance')
                  setView('consultation-guidance')
                }}
                className="group relative flex flex-col bg-white border border-stone-200 hover:border-primary/30 hover:shadow-xl transition-all duration-500 overflow-hidden text-left min-h-[400px]"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-stone-100 group-hover:bg-primary transition-colors duration-500" />
                
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="w-8 h-8 rounded-full bg-[#efdada] flex items-center justify-center text-primary text-xs font-bold">B</span>
                  </div>
                  
                  <p className="text-stone-600 font-light leading-relaxed mb-6 text-lg">
                    &ldquo;I am interested in the Jade Bar, but I am not familiar with the options, and I would like a store team member to guide me through the customization process.&rdquo;
                  </p>

                  <div className="mt-auto flex items-center text-primary text-xs font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                    Select Profile <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </button>

            </div>
          </motion.div>
        )}

        {/* --- Consultation Familiar (Detailed) --- */}
        {view === 'consultation-familiar' && (
          <motion.div
            key="consultation-familiar"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl mx-auto"
          >
             <button 
              onClick={() => setView('consultation-choice')}
              className="group flex items-center text-stone-400 hover:text-primary transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Profiles
            </button>

            <div className="bg-white p-8 md:p-16 shadow-sm border border-stone-100">
              <div className="mb-10 text-center">
                <h2 className="font-heading text-3xl md:text-4xl text-primary mb-3">Custom Order Request</h2>
                <p className="text-stone-500 font-light">Please provide your customization details below.</p>
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
                      required
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
                      required
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

                  {/* Email Field */}
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
                     placeholder="Type of chain & color (optional)"
                   />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Notes</label>
                   <textarea 
                     value={consultNotes}
                     onChange={(e) => setConsultNotes(e.target.value)}
                     className="w-full min-h-[150px] bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-stone-300 leading-relaxed"
                     placeholder="Any additional details..."
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

        {/* --- Consultation Guidance (Simple) --- */}
        {view === 'consultation-guidance' && (
          <motion.div
            key="consultation-guidance"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl mx-auto"
          >
             <button 
              onClick={() => setView('consultation-choice')}
              className="group flex items-center text-stone-400 hover:text-primary transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Profiles
            </button>

            <div className="bg-white p-8 md:p-16 shadow-sm border border-stone-100">
              <div className="mb-10 text-center">
                <h2 className="font-heading text-3xl md:text-4xl text-primary mb-3">Consultation Request</h2>
                <p className="text-stone-500 font-light">We&apos;ll guide you through the process.</p>
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
                      required
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
                      required
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

                  {/* Email Field */}
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
                </div>

                {/* Notes */}
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Notes</label>
                   <textarea 
                     value={consultNotes}
                     onChange={(e) => setConsultNotes(e.target.value)}
                     className="w-full min-h-[150px] bg-stone-50 border-b border-stone-200 px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-stone-300 leading-relaxed"
                     placeholder="Tell us a bit about what you're looking for..."
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
