"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { launchConfig } from '@/lib/launch-config'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassFilter } from '../ui/liquid-glass'
import { Starfield } from '../ui/Starfield'

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
  }, [viewState])

  // Handle the presentation sequence
  useEffect(() => {
    if (viewState === 'present') {
      const timer = setTimeout(() => {
        setIsLocked(false)
        setViewState('unlocked')
      }, 5000) // Extended for reading time
      return () => clearTimeout(timer)
    }
  }, [viewState])

  if (!mounted || viewState === 'unlocked') return null

  // Animation Variants
  const containerExit = {
    opacity: 0,
    y: "-100%", // Move up instead of clip-path for a smoother curtain effect
    transition: { 
      duration: 1.5, 
      ease: [0.77, 0, 0.175, 1], // Quart easing
      delay: 0.5 
    }
  }

  const textReveal = {
    hidden: { y: 100, opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.3, // Slower stagger
        duration: 1.2,
        ease: [0.215, 0.61, 0.355, 1] // Cubic bezier
      }
    })
  }

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#1a231b]"
          initial={{ opacity: 1 }}
          exit={containerExit}
        >
          {/* --- BACKGROUND LAYERS --- */}
          
          {/* 1. Deep Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a231b] via-[#0f1410] to-black" />
          
          {/* 2. Starfield Animation */}
          <Starfield count={1500} speed={0.2} starColor="#e8bfc6" />

          {/* 3. Liquid Glass Distortion Layer */}
          <GlassFilter />
          <div 
            className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
            style={{ filter: "url(#glass-distortion)" }}
          />

          {/* 4. Ambient Glows */}
          <motion.div 
             animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
             transition={{ duration: 8, repeat: Infinity }}
             className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose/10 rounded-full blur-[120px]"
          />
          <motion.div 
             animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.2, 1, 1.2] }}
             transition={{ duration: 10, repeat: Infinity, delay: 1 }}
             className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
          />


          {/* --- CONTENT LAYERS --- */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 perspective-[1000px]">
            
            <AnimatePresence mode="wait">
              {/* PHASE 1: STANDARD COUNTDOWN */}
              {viewState === 'countdown' && (
                <motion.div 
                  key="countdown"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, z: -500, scale: 2, filter: "blur(10px)" }} // "Warp speed" exit
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="flex flex-col items-center w-full max-w-4xl"
                >
                  {/* Floating Logo */}
                  <motion.div 
                    className="relative w-32 h-32 md:w-40 md:h-40 mb-12"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                     <Image 
                       src="/assets/white_tomi_logo.png" 
                       alt="Tomi Jewelry" 
                       fill
                       className="object-contain drop-shadow-[0_0_25px_rgba(232,191,198,0.4)]"
                       priority
                     />
                  </motion.div>

                  <h1 className="font-heading text-2xl md:text-3xl tracking-[0.2em] mb-12 text-rose/80 uppercase text-center">
                    website access granted in..
                  </h1>

                  {/* Glass Timer Cards */}
                  <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-body">
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
                  className="absolute inset-0 flex items-center justify-center"
                >
                   <motion.div
                     key={timeLeft.totalSeconds}
                     initial={{ scale: 0.2, opacity: 0, filter: "blur(20px)" }}
                     animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                     exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
                     transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
                     className="relative font-heading text-[25vw] leading-none text-rose z-20"
                     style={{ textShadow: "0 0 100px rgba(232,191,198,0.5)" }}
                   >
                     {timeLeft.totalSeconds}
                   </motion.div>
                   
                   {/* Shockwave effect */}
                   <motion.div
                      key={`ring-${timeLeft.totalSeconds}`}
                      initial={{ scale: 0.5, opacity: 0.5, border: "2px solid rgba(232,191,198,0.5)" }}
                      animate={{ scale: 2, opacity: 0, border: "0px solid rgba(232,191,198,0)" }}
                      transition={{ duration: 0.8 }}
                      className="absolute w-[30vw] h-[30vw] rounded-full"
                   />
                </motion.div>
              )}

              {/* PHASE 3: PRESENTATION - "GRAND REVEAL" */}
              {viewState === 'present' && (
                <motion.div 
                  key="present"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 1 } }}
                  className="flex flex-col items-center justify-center text-center w-full"
                >
                  <div className="overflow-hidden p-2">
                    <motion.h2 
                        custom={0}
                        variants={textReveal}
                        className="font-heading text-6xl md:text-[8vw] leading-[1.1] text-rose mb-2 md:mb-6 text-balance max-w-5xl drop-shadow-2xl"
                    >
                        welcome to
                    </motion.h2>
                  </div>
                  
                  <div className="overflow-hidden p-4">
                    <motion.h2 
                        custom={1}
                        variants={textReveal}
                        className="font-heading text-7xl md:text-[10vw] leading-[0.9] text-white mb-8 md:mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                        tomi jewelry&apos;s website
                    </motion.h2>
                  </div>

                  <div className="overflow-hidden p-2">
                     <motion.p 
                        custom={2}
                        variants={textReveal}
                        className="font-body text-sm md:text-xl text-rose/70 tracking-[0.5em] uppercase border-t border-rose/30 pt-8 mt-4"
                     >
                        happy shopping!
                     </motion.p>
                  </div>
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
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-6 min-w-[100px] md:min-w-[140px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <span className="text-5xl md:text-7xl font-light tabular-nums leading-none text-white drop-shadow-md font-heading">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-4 text-rose/60 font-medium">
        {label}
      </span>
    </motion.div>
  )
}
