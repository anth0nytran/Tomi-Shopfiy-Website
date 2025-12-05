'use client'

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
  useLayoutEffect,
} from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image'
  mediaSrc: string
  posterSrc?: string
  title?: string
  scrollToExpand?: string
  ctaLabel?: string
  ctaHref?: string
  children?: ReactNode
  backgroundColor?: string
}

/**
 * ScrollExpandMedia - scroll-locked expansion effect
 * Locks the user in place while scrolling drives the animation.
 * Once complete, smoothly transitions to normal document flow.
 */
const ScrollExpandMedia = ({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  title,
  scrollToExpand,
  ctaLabel,
  ctaHref,
  children,
  backgroundColor = '#ffffff',
}: ScrollExpandMediaProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [displayProgress, setDisplayProgress] = useState<number>(0)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [hasCompleted, setHasCompleted] = useState<boolean>(false)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [isMobileState, setIsMobileState] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)
  const hasScrolledRef = useRef<boolean>(false)
  const animationFrameRef = useRef<number | null>(null)
  const accumulatedDeltaRef = useRef<number>(0)
  const overlayContainerRef = useRef<HTMLDivElement | null>(null)
  const mediaContainerRef = useRef<HTMLDivElement | null>(null)
  const [ctaPosition, setCtaPosition] = useState<{ top: number | null; left: number | null }>({
    top: null,
    left: null,
  })

  // Responsive check
  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Super smooth progress interpolation using requestAnimationFrame
  useEffect(() => {
    let lastTime = performance.now()
    
    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1) // Cap at 100ms
      lastTime = currentTime
      
      setDisplayProgress((prev) => {
        const diff = scrollProgress - prev
        if (Math.abs(diff) < 0.0005) return scrollProgress
        // Smooth lerp with time-based easing for consistent speed regardless of frame rate
        const speed = 3.5 // Lower = slower/smoother
        const step = diff * Math.min(speed * deltaTime * 60, 0.15)
        return prev + step
      })
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [scrollProgress])

  // Delay activation readiness to prevent glitchy auto-activation on refresh
  useEffect(() => {
    const readyTimer = setTimeout(() => {
      setIsReady(true)
    }, 1000) // Increased to 1 second
    return () => clearTimeout(readyTimer)
  }, [])

  // Track first intentional scroll
  useEffect(() => {
    const handleFirstScroll = () => {
      if (!hasScrolledRef.current) {
        hasScrolledRef.current = true
      }
    }
    window.addEventListener('scroll', handleFirstScroll, { passive: true, once: true })
    window.addEventListener('wheel', handleFirstScroll, { passive: true, once: true })
    return () => {
      window.removeEventListener('scroll', handleFirstScroll)
      window.removeEventListener('wheel', handleFirstScroll)
    }
  }, [])

  // Check if section is in the "active zone" (centered in viewport)
  const checkActiveZone = useCallback(() => {
    if (!sectionRef.current || hasCompleted || isTransitioning || !isReady || !hasScrolledRef.current) return false
    const rect = sectionRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const topThreshold = viewportHeight * 0.35
    const bottomThreshold = -viewportHeight * 0.1
    return rect.top <= topThreshold && rect.top >= bottomThreshold
  }, [hasCompleted, isTransitioning, isReady])

  // Scroll to center the section when it enters active zone
  const scrollToSection = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const targetY = window.scrollY + rect.top
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }, [])

  // Handle wheel events - intercept and drive progress
  useEffect(() => {
    if (hasCompleted || isTransitioning || !isReady) return

    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return

      hasScrolledRef.current = true

      const inZone = checkActiveZone()

      if (!isActive && inZone && e.deltaY > 0) {
        setIsActive(true)
        scrollToSection()
        e.preventDefault()
        accumulatedDeltaRef.current = 0
        return
      }

      if (isActive) {
        e.preventDefault()

        // Accumulate delta for smoother micro-scrolls
        // Gradual animation multiplier
        accumulatedDeltaRef.current += e.deltaY * 0.0004

        // Only update when accumulated delta is significant enough
        if (Math.abs(accumulatedDeltaRef.current) > 0.002) {
          const delta = accumulatedDeltaRef.current
          accumulatedDeltaRef.current = 0

          setScrollProgress((prev) => {
            const next = Math.min(Math.max(prev + delta, 0), 1)

            if (next <= 0 && delta < 0) {
              setIsActive(false)
              return 0
            }

            if (next >= 1) {
              setIsTransitioning(true)
              setTimeout(() => {
                setHasCompleted(true)
                setIsTransitioning(false)
              }, 700)
              return 1
            }

            return next
          })
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isActive, hasCompleted, isTransitioning, isReady, checkActiveZone, scrollToSection])

  // Handle touch events for mobile
  useEffect(() => {
    if (hasCompleted || isTransitioning || !isReady) return

    let touchStartY = 0
    let lastTouchY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      lastTouchY = touchStartY
      hasScrolledRef.current = true
      accumulatedDeltaRef.current = 0
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!sectionRef.current) return

      const inZone = checkActiveZone()
      const touchY = e.touches[0].clientY
      const delta = (lastTouchY - touchY)
      lastTouchY = touchY

      if (!isActive && inZone && (touchStartY - touchY) > 15) {
        setIsActive(true)
        scrollToSection()
        e.preventDefault()
        return
      }

      if (isActive) {
        e.preventDefault()

        // Accumulate for smoother touch
        accumulatedDeltaRef.current += delta * 0.0008

        if (Math.abs(accumulatedDeltaRef.current) > 0.003) {
          const progressDelta = accumulatedDeltaRef.current
          accumulatedDeltaRef.current = 0

          setScrollProgress((prev) => {
            const next = Math.min(Math.max(prev + progressDelta, 0), 1)

            if (next <= 0 && progressDelta < 0) {
              setIsActive(false)
              return 0
            }

            if (next >= 1) {
              setIsTransitioning(true)
              setTimeout(() => {
                setHasCompleted(true)
                setIsTransitioning(false)
              }, 700)
              return 1
            }

            return next
          })
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isActive, hasCompleted, isTransitioning, isReady, checkActiveZone, scrollToSection])

  // Prevent body scroll when active
  useEffect(() => {
    if (isActive && !hasCompleted) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isActive, hasCompleted])

  // Dimensions based on display progress (smoothed)
  const baseWidth = isMobileState ? 280 : 340
  const maxWidthPx = isMobileState ? 900 : 1400
  const baseHeight = isMobileState ? 340 : 450
  const maxHeightPx = isMobileState ? 520 : 720

  // Use displayProgress for all visual elements for smooth animation
  const mediaWidth = baseWidth + displayProgress * (maxWidthPx - baseWidth)
  const mediaHeight = baseHeight + displayProgress * (maxHeightPx - baseHeight)

  // Smooth text animation values
  const textTranslateX = displayProgress * (isMobileState ? 100 : 80)
  const textOpacity = Math.max(1 - displayProgress * 1.6, 0)

  // Split title into two lines for the parallax text effect
  const words = title ? title.split(' ') : []
  const midpoint = Math.ceil(words.length / 2)
  const firstLine = words.slice(0, midpoint).join(' ')
  const secondLine = words.slice(midpoint).join(' ')

  const showCta = displayProgress >= 0.9 || hasCompleted
  const ctaOffsetY = isMobileState ? -6 : -12

  // Measure the actual rendered media box so CTA follows its center/height during animation
  const updateCtaPosition = useCallback(() => {
    if (!overlayContainerRef.current || !mediaContainerRef.current) return

    const overlayRect = overlayContainerRef.current.getBoundingClientRect()
    const mediaRect = mediaContainerRef.current.getBoundingClientRect()
    const nextPosition = {
      top: mediaRect.bottom - overlayRect.top + (isMobileState ? 14 : 26),
      left: mediaRect.left - overlayRect.left + mediaRect.width / 2,
    }

    setCtaPosition((prev) => {
      if (
        prev.top !== null &&
        prev.left !== null &&
        Math.abs(prev.top - nextPosition.top) < 0.5 &&
        Math.abs(prev.left - nextPosition.left) < 0.5
      ) {
        return prev
      }
      return nextPosition
    })
  }, [isMobileState])

  useLayoutEffect(() => {
    updateCtaPosition()
  }, [updateCtaPosition])

  useEffect(() => {
    const handleResize = () => updateCtaPosition()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateCtaPosition])

  useEffect(() => {
    const raf = requestAnimationFrame(updateCtaPosition)
    return () => cancelAnimationFrame(raf)
  }, [displayProgress, isMobileState, updateCtaPosition])

  useEffect(() => {
    if (isActive || isTransitioning) {
      updateCtaPosition()
    }
  }, [isActive, isTransitioning, updateCtaPosition])

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{
        backgroundColor,
        minHeight: hasCompleted ? 'auto' : '100vh',
        transition: 'min-height 0.7s ease-out',
      }}
    >
      {/* Fixed overlay during animation */}
      <AnimatePresence>
        {(isActive || isTransitioning) && !hasCompleted && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ backgroundColor }}
            initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div
            ref={overlayContainerRef}
            className="relative flex flex-col items-center justify-center w-full h-full"
          >
            {/* Expanding media container - uses smooth displayProgress */}
            <div
              ref={mediaContainerRef}
              className="relative inline-flex flex-col items-center"
              style={{
                width: mediaWidth,
                height: mediaHeight,
                maxWidth: '95vw',
                maxHeight: '85vh',
              }}
            >
              <div
                className="relative z-10 rounded-2xl overflow-hidden"
                style={{
                  width: '100%',
                  height: '100%',
                  boxShadow: `0 ${12 + displayProgress * 30}px ${30 + displayProgress * 40}px rgba(0, 0, 0, ${0.08 + displayProgress * 0.1})`,
                  transition: 'box-shadow 0.3s ease-out',
                }}
              >
                {mediaType === 'video' ? (
                  <video
                    src={mediaSrc}
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    controls={false}
                    disablePictureInPicture
                  />
                ) : (
                  <Image
                    src={mediaSrc}
                    alt={title || 'Media content'}
                    width={1400}
                    height={800}
                    className="w-full h-full object-cover"
                    priority
                  />
                )}
              </div>

              {/* Parallax title text - starts visible at center, slides out smoothly */}
              {title && (
                <div
                  className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                  style={{ opacity: textOpacity }}
                >
                  <div className="flex flex-col items-center justify-center text-center gap-3 w-full">
                    <h2
                      className="text-3xl md:text-5xl lg:text-6xl font-light will-change-transform"
                      style={{
                        transform: `translateX(calc(-${textTranslateX}vw))`,
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-ink, #3c3b3a)',
                      }}
                    >
                      {firstLine}
                    </h2>
                    <h2
                      className="text-3xl md:text-5xl lg:text-6xl font-light text-center will-change-transform"
                      style={{
                        transform: `translateX(calc(${textTranslateX}vw))`,
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-ink, #3c3b3a)',
                      }}
                    >
                      {secondLine}
                    </h2>
                  </div>
                </div>
              )}

              {/* Scroll hint - shows at start */}
              {scrollToExpand && (
                <div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                  style={{ opacity: Math.max(1 - displayProgress * 2, 0) }}
                >
                  <p
                    className="text-xs font-medium text-center tracking-[0.25em] uppercase"
                    style={{ color: 'var(--color-ink, #3c3b3a)', opacity: 0.5 }}
                  >
                    {scrollToExpand}
                  </p>
                  <div className="mt-2 flex justify-center">
                    <div
                      className="w-[1px] h-6 animate-pulse"
                      style={{ background: 'var(--color-ink, #3c3b3a)', opacity: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* CTA + continue hint - centered below the image, appears near completion */}
              <motion.div
                className="absolute left-1/2 z-30 flex flex-col items-center gap-3"
                style={{
                  top:
                    ctaPosition.top !== null
                      ? `${ctaPosition.top}px`
                      : `calc(50% + ${mediaHeight / 2}px + 20px)`,
                  left: ctaPosition.left !== null ? `${ctaPosition.left}px` : '50%',
                  transform: `translate(-50%, ${ctaOffsetY}px)`,
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: showCta ? 1 : 0, y: showCta ? 0 : 16 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {ctaLabel && ctaHref && (
                  <a
                    href={ctaHref}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full border text-xs tracking-[0.2em] uppercase font-semibold transition-all hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      borderColor: 'rgba(60,59,58,0.3)',
                      color: 'var(--color-ink,#3c3b3a)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    }}
                  >
                    {ctaLabel}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
                
                {/* Continue scrolling hint - appears when animation is nearly complete */}
                {displayProgress >= 0.95 && (
                  <motion.div
                    className="flex flex-col items-center mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <p
                      className="text-[10px] font-medium tracking-[0.2em] uppercase mb-1"
                      style={{ color: 'var(--color-ink, #3c3b3a)' }}
                    >
                      continue scrolling
                    </p>
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        style={{ color: 'var(--color-ink, #3c3b3a)' }}
                      >
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Completed state - normal in-flow content */}
      <motion.div
        ref={contentRef}
        className="relative w-full flex flex-col items-center justify-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasCompleted ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ minHeight: hasCompleted ? 'auto' : '100vh', backgroundColor }}
      >
        {/* Final expanded image */}
        <div
          className="relative rounded-2xl overflow-hidden mx-auto"
          style={{
            width: `${maxWidthPx}px`,
            maxWidth: '95vw',
            boxShadow: '0 40px 80px rgba(0, 0, 0, 0.12)',
          }}
        >
          {mediaType === 'video' ? (
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
              controls={false}
              disablePictureInPicture
            />
          ) : (
            <Image
              src={mediaSrc}
              alt={title || 'Media content'}
              width={1400}
              height={800}
              className="w-full h-auto object-cover"
              priority
            />
          )}
        </div>

        {/* CTA below image */}
        {ctaLabel && ctaHref && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border text-xs tracking-[0.2em] uppercase font-semibold transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderColor: 'rgba(60,59,58,0.3)',
                color: 'var(--color-ink,#3c3b3a)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              }}
            >
              {ctaLabel}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </motion.div>
        )}

        {/* Optional children content */}
        {children && (
          <div className="w-full px-8 py-10 md:px-16 lg:py-16">{children}</div>
        )}
      </motion.div>

      {/* Placeholder for initial scroll trigger (before activation) */}
      {!isActive && !hasCompleted && (
        <div className="relative w-full flex flex-col items-center justify-center py-20 min-h-[80vh]">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: `${baseWidth}px`,
              height: `${baseHeight}px`,
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
            }}
          >
            {mediaType === 'video' ? (
              <video
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                controls={false}
                disablePictureInPicture
              />
            ) : (
              <Image
                src={mediaSrc}
                alt={title || 'Media content'}
                width={1400}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            )}
          </div>

          {/* Title overlay - visible at start */}
          {title && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="flex flex-col items-center justify-center text-center gap-3 w-full">
                <h2
                  className="text-3xl md:text-5xl lg:text-6xl font-light"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-ink, #3c3b3a)',
                  }}
                >
                  {firstLine}
                </h2>
                <h2
                  className="text-3xl md:text-5xl lg:text-6xl font-light text-center"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-ink, #3c3b3a)',
                  }}
                >
                  {secondLine}
                </h2>
              </div>
            </div>
          )}

          {/* Scroll hint */}
          {scrollToExpand && (
            <div className="mt-8">
              <p
                className="text-xs font-medium text-center tracking-[0.25em] uppercase"
                style={{ color: 'var(--color-ink, #3c3b3a)', opacity: 0.5 }}
              >
                {scrollToExpand}
              </p>
              <div className="mt-2 flex justify-center">
                <div
                  className="w-[1px] h-6 animate-pulse"
                  style={{ background: 'var(--color-ink, #3c3b3a)', opacity: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ScrollExpandMedia
