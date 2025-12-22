"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { launchConfig } from '@/lib/launch-config'
import { markLaunchUnlocked } from '@/lib/launch-unlock'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion'
import { GlassFilter } from '../ui/liquid-glass'
import { Starfield } from '../ui/Starfield'
import { PolaroidScatter } from '../ui/PolaroidScatter'

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  })
  const [isLocked, setIsLocked] = useState(launchConfig.isEnabled)
  const [mounted, setMounted] = useState(false)
  const [viewState, setViewState] = useState<'countdown' | 'final' | 'unlocked'>('countdown')

  const accessGatePassword = launchConfig.accessGate.password.trim()
  const isAccessGateEnabled = accessGatePassword.length > 0
  const [accessInput, setAccessInput] = useState('')
  const [accessError, setAccessError] = useState<string | null>(null)
  const [isAccessFormOpen, setIsAccessFormOpen] = useState(true)
  const didMarkUnlocked = useRef(false)

  // Mouse tracking for spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const spotlightBackground = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 80%)`

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  // Effect to lock body scroll when locked
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isLocked])

  // Let the rest of the app know when the site is actually unlocked.
  useEffect(() => {
    if (!mounted) return
    if (didMarkUnlocked.current) return
    if (!launchConfig.isEnabled) {
      didMarkUnlocked.current = true
      markLaunchUnlocked()
      return
    }
    if (!isLocked) {
      didMarkUnlocked.current = true
      markLaunchUnlocked()
    }
  }, [isLocked, mounted])

  useEffect(() => {
    setMounted(true)

    // Test mode should mirror production: once it "opens", it should stay open on refresh.
    if (launchConfig.testMode.enabled) {
      try {
        if (sessionStorage.getItem('tomi_launch_test_opened') === '1') {
          setIsLocked(false)
          setViewState('unlocked')
          return
        }
      } catch {
        // ignore
      }
    }

    if (viewState === 'unlocked') return
    
    if (!launchConfig.isEnabled) {
      setIsLocked(false)
      setViewState('unlocked')
      return
    }

    // Password bypass (client-side): if previously granted, unlock immediately.
    if (isAccessGateEnabled) {
      try {
        // Optional cleanup: remove any older versioned keys so localStorage doesn't accumulate.
        const base = launchConfig.accessGate.storageKeyBase
        const currentKey = launchConfig.accessGate.storageKey
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i)
          if (!k) continue
          if (k.startsWith(`${base}:`) && k !== currentKey) localStorage.removeItem(k)
          if (k === base) localStorage.removeItem(k) // legacy pre-version key
        }

        if (localStorage.getItem(launchConfig.accessGate.storageKey) === '1') {
          setIsLocked(false)
          return
        }
      } catch {
        // Ignore storage errors (private mode, disabled storage, etc.)
      }
    }

    if (!isLocked) return

    const calculateTimeLeft = (targetDate: number) => {
      const now = new Date().getTime()
      const distance = targetDate - now
      return distance
    }

    // Set target date once
    const getTargetDate = () => {
       if (launchConfig.testMode.enabled) {
          const stored = sessionStorage.getItem('tomi_launch_target')
          if (stored && Number(stored) > new Date().getTime()) {
             return Number(stored)
          }
          const newTarget = new Date().getTime() + (launchConfig.testMode.durationInSeconds * 1000)
          sessionStorage.setItem('tomi_launch_target', String(newTarget))
          return newTarget
       }
       return new Date(launchConfig.targetDate).getTime()
    }
    
    const targetDate = getTargetDate()

    const interval = setInterval(() => {
      const distance = calculateTimeLeft(targetDate)
      const totalSeconds = Math.ceil(distance / 1000)

      if (distance < 0) {
        clearInterval(interval)
        if (launchConfig.testMode.enabled) {
          try {
            sessionStorage.setItem('tomi_launch_test_opened', '1')
            sessionStorage.removeItem('tomi_launch_target')
          } catch {
            // ignore
          }
        }
        // Immediately trigger the curtain exit animation by unlocking.
        setIsLocked(false)
      } else {
        // State transitions - Use exact 5 to avoid jumping
        if (totalSeconds <= 5 && totalSeconds > 0 && viewState !== 'final') {
           // Only transition if we are coming from 'countdown'
           if (viewState === 'countdown') {
              setViewState('final')
           }
        }

        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          totalSeconds
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [viewState, isLocked, isAccessGateEnabled])

  const handleAccessSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!isAccessGateEnabled) return

    const typed = accessInput.trim()
    if (typed.length > 0 && typed === accessGatePassword) {
      try {
        localStorage.setItem(launchConfig.accessGate.storageKey, '1')
      } catch {
        // Best-effort persistence only.
      }
      setAccessError(null)
      setIsLocked(false)
      return
    }

    setAccessError('Incorrect password')
  }

  // Don't render until mounted to match server HTML as best as possible, 
  // but to prevent flash, layout should handle initial state or we return a simple block.
  // We'll return a basic block if not mounted but enabledConfig is true
  if (!mounted) {
    // Avoid a full-screen flash when countdown is disabled (the common production case).
    // Only block during hydration when the countdown is actually enabled.
    if (!launchConfig.isEnabled) return null
    return <div className="fixed inset-0 z-[9999] bg-[#1a231b]" />
  }
  
  if (viewState === 'unlocked') return null

  const textReveal = {
    hidden: { y: 100, opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.3, 
        duration: 1.2,
        ease: [0.215, 0.61, 0.355, 1] 
      }
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.8, ease: "easeInOut" } }
  }

  return (
    <AnimatePresence onExitComplete={() => setViewState('unlocked')}>
      {isLocked && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-transparent" // Transparent bg to allow see-through
          onMouseMove={handleMouseMove}
        >
          {/* --- CURTAINS (Sideways Reveal) --- */}
          {/* Left Curtain */}
          <motion.div 
            className="absolute top-0 left-0 h-full w-1/2 bg-[#1a231b]/80 backdrop-blur-md z-0 border-r border-white/10"
            initial={{ x: 0 }}
            exit={{ x: "-100%", transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.2 } }}
          />
          {/* Right Curtain */}
          <motion.div 
            className="absolute top-0 right-0 h-full w-1/2 bg-[#1a231b]/80 backdrop-blur-md z-0 border-l border-white/10"
            initial={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.2 } }}
          />

          {/* --- ATMOSPHERE CONTAINER (Fades out before curtains split) --- */}
          <motion.div 
             className="absolute inset-0 z-1 pointer-events-none"
             exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
             {/* Base Gradient - Significantly reduced opacity to show site behind */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#38473b]/80 via-[#2a352c]/80 to-[#1a231b]/80 backdrop-blur-sm" />
             
             {/* Noise Texture */}
             <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                  }} 
             />

             {/* Spotlight */}
             <motion.div
               className="absolute inset-0 mix-blend-soft-light"
               style={{ background: spotlightBackground }}
             />

             {/* Starfield */}
             <Starfield count={200} speed={0.03} starColor="#ead6d6" />

             {/* Liquid Glass - Enhanced for tease effect */}
             <GlassFilter />
             <div 
               className="absolute inset-0 opacity-40 mix-blend-soft-light backdrop-blur-[2px]"
               style={{ filter: "url(#glass-distortion)" }}
             />

             {/* Ambient Glows */}
             <motion.div 
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-[#E8BFC6]/20 rounded-full blur-[150px]"
             />
             <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.1, 1, 1.1] }}
                transition={{ duration: 12, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-[#ead6d6]/15 rounded-full blur-[180px]"
             />
          </motion.div>

          {/* --- INTERACTIVE ELEMENTS --- */}
          <AnimatePresence>
            {viewState === 'countdown' && (
              <motion.div
                className="absolute inset-0 z-[20] pointer-events-none"
                key="polaroids"
                exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)", transition: { duration: 0.8 } }}
              >
                <PolaroidScatter />
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- MAIN CONTENT --- */}
          <div className="relative z-[30] w-full h-full flex flex-col items-center justify-center px-4 perspective-[1000px] pointer-events-none">
            
            <AnimatePresence mode="wait">
              {/* PHASE 1: STANDARD COUNTDOWN */}
              {viewState === 'countdown' && (
                <motion.div 
                  key="countdown"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 0.5 } }}
                  className="flex flex-col items-center w-full max-w-4xl"
                >
                  {/* Floating Logo */}
                  <motion.div 
                    className="relative w-32 h-32 md:w-40 md:h-40 mb-8"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                     <Image 
                       src="/assets/white_tomi_logo.png" 
                       alt="Tomi Jewelry" 
                       fill
                       className="object-contain drop-shadow-2xl"
                       priority
                     />
                  </motion.div>

                  <h1 className="font-heading text-base md:text-xl tracking-[0.2em] md:tracking-[0.3em] mb-8 md:mb-12 text-rose/90 uppercase text-center font-light px-4">
                    Website Access Opening In
                  </h1>

                  {/* Minimalist Timer */}
                  <div className="flex flex-wrap justify-center items-center gap-4 md:gap-16 font-body w-full max-w-[90vw]">
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <div className="hidden md:block w-px h-12 bg-white/20" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <div className="hidden md:block w-px h-12 bg-white/20" />
                    <TimeUnit value={timeLeft.minutes} label="Minutes" />
                    <div className="hidden md:block w-px h-12 bg-white/20" />
                    <TimeUnit value={timeLeft.seconds} label="Seconds" />
                  </div>
                </motion.div>
              )}

              {/* PHASE 2: FINAL 5 SECONDS */}
              {viewState === 'final' && (
                <motion.div 
                  key="final"
                  className="absolute inset-0 flex items-center justify-center"
                >
                   {/* Intense Background Pulse */}
                   <motion.div 
                      className="absolute inset-0 bg-rose/10 mix-blend-overlay z-0"
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                   />
                   
                   <motion.div
                     key={timeLeft.totalSeconds}
                     initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                     animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                     exit={{ scale: 1.5, opacity: 0 }}
                     transition={{ duration: 0.4 }}
                     className="relative font-heading text-[25vw] leading-none text-rose z-20"
                     style={{ textShadow: "0 0 100px rgba(232,191,198,0.8)" }}
                   >
                     {timeLeft.totalSeconds}
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- INTERNAL ACCESS GATE --- */}
          {isAccessGateEnabled && (viewState === 'countdown' || viewState === 'final') && (
            <div className="absolute bottom-6 left-1/2 z-[80] w-full max-w-md -translate-x-1/2 px-4 pointer-events-auto">
              {!isAccessFormOpen ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAccessError(null)
                      setIsAccessFormOpen(true)
                    }}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/80 backdrop-blur-md hover:bg-white/15 hover:text-white/90"
                  >
                    Team Access
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleAccessSubmit}
                  className="mx-auto flex w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 p-2 pl-4 backdrop-blur-md shadow-lg"
                >
                  <input
                    type="password"
                    value={accessInput}
                    onChange={(e) => {
                      setAccessInput(e.target.value)
                      if (accessError) setAccessError(null)
                    }}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAccessError(null)
                      setAccessInput('')
                      setIsAccessFormOpen(false)
                    }}
                    className="shrink-0 rounded-full px-3 py-2 text-xs text-white/70 hover:text-white/90"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-white/20 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/90 hover:bg-white/30"
                  >
                    Enter
                  </button>
                </form>
              )}

              {accessError && (
                <p className="mt-2 text-center text-xs text-rose/80">{accessError}</p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center min-w-[60px] md:min-w-[100px]"
    >
      <span className="text-4xl md:text-7xl font-light tabular-nums leading-none text-white drop-shadow-lg font-heading">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[8px] md:text-xs uppercase tracking-[0.2em] mt-2 md:mt-4 text-rose/70 font-medium">
        {label}
      </span>
    </motion.div>
  )
}
