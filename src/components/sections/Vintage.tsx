'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type HighlightTile = {
  id: string
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
  href: string
  image: { src: string; alt: string }
}

const SPOTLIGHTS: HighlightTile[] = [
  {
    id: 'moonlight',
    eyebrow: 'OUR BEST SELLING COLLECTION',
    title: 'Moonlight',
    body: 'Soft jade tones with a luminous finish for every stack. The moonlight collection brings a subtle glow to your everyday style.',
    ctaLabel: 'shop collection',
    href: '/jade-bar',
    image: { src: '/assets/moonstone.jpeg', alt: 'Moonlight collection rings' },
  },
  {
    id: 'flutter',
    eyebrow: 'DAINTY AND ETHEREAL',
    title: 'Flutter',
    body: 'Airy silhouettes that float over skin like light. Inspired by the delicate movement of butterfly wings.',
    ctaLabel: 'shop collection',
    href: '/jade-bar',
    image: { src: '/assets/flutter.png', alt: 'Flutter layered necklace' },
  },
  {
    id: 'refine',
    eyebrow: 'CLASSIC AND TIMELESS',
    title: 'Refine',
    body: 'Streamlined pieces designed to polish your everyday look. The definition of modern elegance.',
    ctaLabel: 'shop collection',
    href: '/jade-bar',
    image: { src: '/assets/refine.jpg', alt: 'Refine collection hoops' },
  },
  {
    id: 'embellish',
    eyebrow: 'ADORN YOURSELF',
    title: 'Embellish',
    body: 'Mix-and-match accents that invite endless layering. Create a look that is uniquely yours with these versatile pieces.',
    ctaLabel: 'shop collection',
    href: '/jade-bar',
    image: { src: '/assets/embellish.jpg', alt: 'Embellish collection display' },
  },
  {
    id: 'one-of-a-kind',
    eyebrow: 'VINTAGE PIECES',
    title: 'One Of A Kind',
    body: 'Hand-curated heirlooms—once they’re gone, they’re gone. Own a piece of history.',
    ctaLabel: 'shop collection',
    href: '/shop/category/one-of-a-kind-vintage',
    image: { src: '/assets/1kind.jpg', alt: 'One of a kind vintage watches' },
  },
]

export function Vintage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % SPOTLIGHTS.length)
  }, [])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + SPOTLIGHTS.length) % SPOTLIGHTS.length)
  }, [])

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(timer)
  }, [handleNext])

  const currentItem = SPOTLIGHTS[currentIndex]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }

  return (
    <section className="relative w-full h-[85vh] bg-[#F4F1ED] overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentItem.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
        >
          {/* Content Left */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-24 bg-[#F4F1ED] z-10">
            <div className="max-w-xl">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block mb-4 text-xs font-medium tracking-[0.2em] uppercase text-stone-500"
              >
                {currentItem.eyebrow}
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-5xl md:text-7xl mb-6 text-stone-900"
              >
                {currentItem.title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-stone-600 mb-8 leading-relaxed max-w-md"
              >
                {currentItem.body}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href={currentItem.href}
                  className="inline-flex items-center justify-center h-12 px-8 text-sm uppercase tracking-widest border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors duration-300"
                >
                  {currentItem.ctaLabel}
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Image Right */}
          <div className="flex-1 relative h-full bg-stone-200">
             <Image
              src={currentItem.image.src}
              alt={currentItem.image.alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex gap-4 z-20">
        <button
          onClick={handlePrev}
          className="w-12 h-12 flex items-center justify-center border border-stone-900/20 bg-white/50 hover:bg-white transition-colors backdrop-blur-sm rounded-full"
          aria-label="Previous collection"
        >
          <ChevronLeft className="w-5 h-5 text-stone-900" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 flex items-center justify-center border border-stone-900/20 bg-white/50 hover:bg-white transition-colors backdrop-blur-sm rounded-full"
          aria-label="Next collection"
        >
          <ChevronRight className="w-5 h-5 text-stone-900" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-8 md:left-24 flex gap-3 z-20">
        {SPOTLIGHTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1)
              setCurrentIndex(idx)
            }}
            className={`h-[2px] transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-stone-900' : 'w-4 bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
