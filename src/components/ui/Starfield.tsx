"use client"

import React, { useEffect, useRef } from 'react'

interface StarfieldProps {
  speed?: number
  backgroundColor?: string
  starColor?: string
  count?: number
}

export const Starfield: React.FC<StarfieldProps> = ({
  speed = 0.05,
  backgroundColor = 'transparent',
  starColor = '#ffffff',
  count = 800,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let stars: Array<{ x: number; y: number; z: number; o: number }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 2000,
        o: Math.random(),
      }))
    }

    const animate = () => {
      if (!ctx || !canvas) return

      // Clear with trail effect
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // If transparent, we need to clearrect
      if (backgroundColor === 'transparent') {
         ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      stars.forEach((star) => {
        star.z -= speed * 20 // Move towards screen

        // Reset if passed screen
        if (star.z <= 0) {
          star.z = 2000
          star.x = Math.random() * canvas.width - canvas.width / 2
          star.y = Math.random() * canvas.height - canvas.height / 2
        }

        const x = cx + (star.x / star.z) * canvas.width
        const y = cy + (star.y / star.z) * canvas.height
        const size = (1 - star.z / 2000) * 3 // Size based on depth

        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const alpha = (1 - star.z / 2000) * star.o
          ctx.fillStyle = starColor
          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(x, y, size, 0, 2 * Math.PI)
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [speed, backgroundColor, starColor, count])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  )
}

