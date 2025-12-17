"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { launchConfig } from '@/lib/launch-config'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassFilter } from '../ui/liquid-glass'

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
  const [viewState, setViewState] = useState<'countdown' | 'final' | 'present' | 'unlocked'>('countdown')

  useEffect(() => {
    setMounted(true)
    
    if (!launchConfig.isEnabled) {
      setIsLocked(false)
      setViewState('unlocked')
      return
    }

    const calculateTimeLeft = (targetDate: number) => {
      const now = new Date().getTime()
      const distance = targetDate - now
      return distance
    }

    // Set target date once
    const getTargetDate = () => {
       if (launchConfig.testMode.enabled) {
          // If we already have a stored target in session storage, use it to prevent reset on refresh (optional, but good for testing flow)
          // For now, to fix the specific issue of "resetting", we need to ensure the hook logic is sound.
          // The issue is likely that when viewState changes, the effect re-runs, and because of how we calculated targetDate inside the effect without a ref,
          // it might be re-evaluating 'now + 10s'.
          
          // Actually, let's just make sure we don't reset the target date on re-renders of this effect.
          // We can use a ref or just rely on the fact that we need a stable target.
          
          // FIX: For the user's specific bug "starts over 10 9 8...", it implies the effect is re-running and creating a NEW target date.
          // We need to persist the target date across re-renders of the component.
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
        if (viewState !== 'present' && viewState !== 'unlocked') {
           setViewState('present')
        }
      } else {
        // State transitions
        if (totalSeconds <= 5 && totalSeconds > 0 && viewState !== 'final') {
          setViewState('final')
        }

        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          totalSeconds
        })
      }
    }, 100)

    return () => clearInterval(interval)
  }, [viewState]) // Added viewState dependency to ensure we don't miss transitions

  // Handle the presentation sequence
  useEffect(() => {
    if (viewState === 'present') {
      const timer = setTimeout(() => {
        setIsLocked(false)
        setViewState('unlocked')
      }, 4000) // Show "Tomi Presents" for 4 seconds
      return () => clearTimeout(timer)
    }
  }, [viewState])

  if (!mounted || viewState === 'unlocked') return null

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-primary"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 1.5, ease: "easeInOut" },
            // Optional: Add a scale out or curtain effect here
            // clipPath: "circle(0% at 50% 50%)" 
          }}
        >
          {/* Liquid Glass Background */}
          <GlassFilter />
          <div className="absolute inset-0 z-0">
             {/* Base Gradient */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#2a352c] to-black opacity-80" />
             
             {/* Animated Liquid Layer */}
             <div 
               className="absolute inset-0 opacity-40"
               style={{
                 filter: "url(#glass-distortion)",
                 background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)",
                 transform: "scale(1.2)"
               }}
             />
             
             {/* Moving Orbs for Distortion Interaction */}
             <motion.div 
               animate={{ 
                 x: [0, 100, -100, 0], 
                 y: [0, -100, 100, 0],
                 scale: [1, 1.2, 0.8, 1]
               }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose/10 rounded-full blur-[100px]"
             />
             <motion.div 
               animate={{ 
                 x: [0, -150, 150, 0], 
                 y: [0, 150, -150, 0],
                 scale: [1, 1.5, 0.9, 1]
               }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#4a5e4d]/30 rounded-full blur-[120px]"
             />
          </div>

          {/* Content Container */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            
            <AnimatePresence mode="wait">
              {/* PHASE 1: STANDARD COUNTDOWN */}
              {viewState === 'countdown' && (
                <motion.div 
                  key="countdown"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center space-y-12 p-8 text-center"
                >
                  {/* Logo */}
                  <motion.div 
                    className="relative w-48 h-20 mb-8"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                     <Image 
                       src="/assets/white_tomi_logo.png" 
                       alt="Tomi Jewelry" 
                       fill
                       className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                       priority
                     />
                  </motion.div>

                  <h1 className="font-heading text-3xl md:text-5xl tracking-wide mb-4 text-rose drop-shadow-lg">
                    website access granted in..
                  </h1>

                  {/* Timer */}
                  <div className="flex items-start justify-center gap-4 md:gap-12 font-body">
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <TimeUnit value={timeLeft.minutes} label="Minutes" />
                    <TimeUnit value={timeLeft.seconds} label="Seconds" />
                  </div>
                </motion.div>
              )}

              {/* PHASE 2: FINAL 5 SECONDS */}
              {viewState === 'final' && (
                <motion.div 
                  key="final"
                  className="flex flex-col items-center justify-center"
                >
                   <motion.div
                     key={timeLeft.totalSeconds} // Re-animate on every second change
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 1.5, opacity: 0 }}
                     transition={{ duration: 0.5 }}
                     className="font-heading text-[15rem] md:text-[25rem] leading-none text-rose drop-shadow-[0_0_30px_rgba(234,214,214,0.5)]"
                   >
                     {timeLeft.totalSeconds}
                   </motion.div>
                </motion.div>
              )}

              {/* PHASE 3: PRESENTATION */}
              {viewState === 'present' && (
                <motion.div 
                  key="present"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-center justify-center text-center px-4"
                >
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="font-heading text-4xl md:text-6xl text-rose mb-4"
                  >
                    welcome to tomi jewelry&apos;s website
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="font-body text-xl md:text-2xl text-white/80 tracking-[0.2em] uppercase"
                  >
                    happy shopping!
                  </motion.p>
                  
                  {/* Decorative Line */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.8, duration: 1 }}
                    className="w-32 h-px bg-rose/50 mt-8"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white/5 backdrop-blur-sm rounded-lg p-4 min-w-[80px] md:min-w-[120px] border border-white/10 shadow-xl">
      <span className="text-4xl md:text-6xl font-light tabular-nums leading-none text-white drop-shadow-md">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs uppercase tracking-widest mt-2 text-rose/80 font-medium">
        {label}
      </span>
    </div>
  )
}
