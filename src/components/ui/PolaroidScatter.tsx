"use client"

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface PolaroidProps {
  src: string
  caption?: string
  angle?: number
  x?: number
  y?: number
  delay?: number
  containerRef: React.RefObject<HTMLDivElement>
}

const Polaroid: React.FC<PolaroidProps> = ({ src, caption, angle = 0, x = 0, y = 0, delay = 0, containerRef }) => {
  // Removed unused state variables
  const randomRotate = useRef(angle + (Math.random() * 6 - 3)).current
  
  return (
    <motion.div
      drag
      dragConstraints={containerRef} // Use the container as the boundary
      dragElastic={0.2} // Bouncy edges
      dragMomentum={true}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 10, power: 0.1 }} // Slower, heavier throw with bounce
      whileHover={{ scale: 1.1, zIndex: 50, rotate: 0, cursor: "grab" }}
      whileDrag={{ scale: 1.15, zIndex: 100, cursor: "grabbing" }}
      initial={{ opacity: 0, y: 500, rotate: randomRotate }}
      animate={{ opacity: 1, y: y, x: x, rotate: randomRotate }}
      transition={{ 
        type: "spring", 
        damping: 20, 
        stiffness: 100, 
        delay: delay 
      }}
      className="absolute flex flex-col items-center bg-white p-3 pb-8 shadow-xl transform-gpu cursor-grab active:cursor-grabbing w-[180px] md:w-[220px]"
      style={{
        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)"
      }}
      // Removed unused handlers
    >
      <div className="relative w-full aspect-[4/5] bg-gray-100 mb-3 overflow-hidden grayscale-[20%] hover:grayscale-0 transition-all duration-500">
        <Image 
          src={src} 
          alt={caption || "Tomi Jewelry"}
          fill
          className="object-cover"
          draggable={false}
        />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>
      
      {caption && (
        <div className="font-handwriting text-ink/80 text-sm md:text-base -rotate-1">
          {caption}
        </div>
      )}
    </motion.div>
  )
}

export const PolaroidScatter = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Collection of images to scatter
  const images = [
    { src: "/assets/social_pic1.png", caption: "studio vibes ✨", angle: -4, x: -350, y: -180 },
    { src: "/assets/social_pic2.png", caption: "golden hour", angle: 3, x: 350, y: -180 },
    { src: "/assets/social_pic3.png", caption: "details", angle: -6, x: -380, y: 150 },
    { src: "/assets/product_ph1.png", caption: "new collection", angle: 5, x: 380, y: 150 },
    { src: "/assets/1kind.jpg", caption: "one of a kind", angle: -2, x: 0, y: 280 }, // Bottom center
  ]

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
       {/* Container specifically for interactive elements that re-enables pointer events */}
       <div className="relative w-full h-full max-w-6xl mx-auto">
          {images.map((img, i) => (
            <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="pointer-events-auto">
                 <Polaroid 
                   {...img} 
                   containerRef={containerRef}
                   delay={1.5 + (i * 0.2)} // Stagger in after initial load
                 />
               </div>
            </div>
          ))}
       </div>
    </div>
  )
}

