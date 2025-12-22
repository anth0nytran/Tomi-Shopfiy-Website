'use client'

import React from 'react'
import Image from 'next/image'

// Fallback local slides in case remote fetch fails
const FALLBACK_SLIDES = [
  { id: 'social-1', src: '/assets/social_pic1.png', alt: 'Social highlight 1' },
  { id: 'social-2', src: '/assets/social_pic2.png', alt: 'Social highlight 2' },
  { id: 'social-3', src: '/assets/social_pic3.png', alt: 'Social highlight 3' },
]

type Slide = { id: string; src: string; alt: string; href?: string }
const SOCIAL_TITLE_COPY = 'we love @tomijewelry on you'

// Proxy Google Drive URLs through our API to avoid CORS/interstitial
function proxyUrl(src: string): string {
  if (src.includes('drive.google.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`
  }
  return src
}

export function Social() {
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const [typingIndex, setTypingIndex] = React.useState(0)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const typedText = SOCIAL_TITLE_COPY.slice(0, typingIndex)
  const [slides, setSlides] = React.useState<Slide[]>(FALLBACK_SLIDES)

  // Fetch slides via API route to avoid client-side CORS
  React.useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/social', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch sheet')
        const data = await res.json()
        if (Array.isArray(data.slides) && data.slides.length) {
          setSlides(data.slides)
        }
      } catch (err) {
        console.error('Social slides fetch failed, using fallback', err)
      }
    }

    fetchSlides()
  }, [])

  React.useEffect(() => {
    const isComplete = typingIndex === SOCIAL_TITLE_COPY.length
    const isAtStart = typingIndex === 0
    const typingSpeed = isDeleting ? 45 : 90
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && isComplete) {
      timeout = setTimeout(() => setIsDeleting(true), 1600)
    } else if (isDeleting && isAtStart) {
      timeout = setTimeout(() => setIsDeleting(false), 650)
    } else {
      timeout = setTimeout(() => {
        setTypingIndex((prev) => prev + (isDeleting ? -1 : 1))
      }, typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [typingIndex, isDeleting])

  // --- Infinite Scroll Logic ---

  // 1. Triple the slides so we have [A, B, C] ... [A, B, C] ... [A, B, C]
  // Ideally just duplicating once (double) is enough if we manage it well,
  // but tripling is safer for "start in middle".
  const displaySlides = React.useMemo(() => {
    // If we have very few slides, we might need more copies to fill the screen.
    // For simplicity, let's just triple them.
    return [
      ...slides.map((s) => ({ ...s, uniqueKey: `${s.id}-p` })),
      ...slides.map((s) => ({ ...s, uniqueKey: `${s.id}-c` })),
      ...slides.map((s) => ({ ...s, uniqueKey: `${s.id}-n` })),
    ]
  }, [slides])

  // 2. Initialize scroll position to the middle set
  React.useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Wait for layout
    const initScroll = () => {
      const slide = track.querySelector<HTMLElement>('[data-slide]')
      if (!slide) return

      const slideWidth = slide.clientWidth
      const gap = parseFloat(getComputedStyle(track).columnGap || '16')
      const singleSetWidth = (slideWidth + gap) * slides.length

      // Scroll to start of the middle set
      track.scrollLeft = singleSetWidth
    }

    // Small timeout to ensure DOM is ready/images loaded enough to have width
    const t = setTimeout(initScroll, 100)
    return () => clearTimeout(t)
  }, [slides]) // Re-run if slides change

  // 3. Monitor scroll to loop silently
  const handleScroll = React.useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const slide = track.querySelector<HTMLElement>('[data-slide]')
    if (!slide) return

    const slideWidth = slide.clientWidth
    const gap = parseFloat(getComputedStyle(track).columnGap || '16')
    const singleSetWidth = (slideWidth + gap) * slides.length

    // If we scrolled too far left (into first set), jump to middle set
    if (track.scrollLeft < 50) { // arbitrary buffer
       track.scrollLeft += singleSetWidth
    }
    // If we scrolled too far right (into third set), jump back to middle set
    else if (track.scrollLeft >= singleSetWidth * 2 - 50) {
       track.scrollLeft -= singleSetWidth
    }
  }, [slides.length])


  const scrollCarousel = React.useCallback((direction: 'prev' | 'next') => {
    if (!trackRef.current) return
    const track = trackRef.current
    const slide = track.querySelector<HTMLElement>('[data-slide]')
    const slideWidth = slide?.clientWidth ?? 220
    const gap = parseFloat(getComputedStyle(track).columnGap || '16')
    const offset = slideWidth + gap

    track.scrollBy({ left: direction === 'next' ? offset : -offset, behavior: 'smooth' })
  }, [])

  return (
    <section id="social" className="section section--social" data-section-type="social" aria-label="birthday edit social carousel">
      <div className="container">
        <div className="social-panel">
          <div className="social-header">
            <p className="social-title" aria-label={SOCIAL_TITLE_COPY}>
              <span className="social-title-typing" aria-hidden="true">
                {typedText}
                <span className="social-title-caret" />
              </span>
            </p>
            <a className="social-cta-btn" href="https://www.instagram.com/tomijewelry" target="_blank" rel="noreferrer">
              find us on social
            </a>
          </div>

          <div className="social-carousel" role="region" aria-roledescription="carousel" aria-label="Community highlights">
            <button className="social-nav-btn social-nav-btn--prev" type="button" aria-label="View previous social post" onClick={() => scrollCarousel('prev')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div 
              className="social-track" 
              ref={trackRef} 
              onScroll={handleScroll}
            >
              {displaySlides.map((slide, idx) => (
                <div key={slide.uniqueKey} className="social-slide" data-slide>
                  {slide.href ? (
                    <a href={slide.href} target="_blank" rel="noreferrer" className="block w-full h-full">
                      <Image
                        src={proxyUrl(slide.src)}
                        alt={slide.alt}
                        fill
                        sizes="(min-width: 1024px) 220px, (min-width: 768px) 45vw, 72vw"
                        className="social-slide-media"
                        priority={idx < slides.length * 2 && idx >= slides.length} // prioritize middle set
                        unoptimized
                      />
                    </a>
                  ) : (
                    <Image
                      src={proxyUrl(slide.src)}
                      alt={slide.alt}
                      fill
                      sizes="(min-width: 1024px) 220px, (min-width: 768px) 45vw, 72vw"
                      className="social-slide-media"
                      priority={idx < slides.length * 2 && idx >= slides.length}
                      unoptimized
                    />
                  )}
                </div>
              ))}
            </div>
            <button className="social-nav-btn social-nav-btn--next" type="button" aria-label="View next social post" onClick={() => scrollCarousel('next')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
