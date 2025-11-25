'use client'

import React from 'react'
import Image from 'next/image'

const socialSlides = [
  { id: 'social-1', src: '/assets/social_pic1.png', alt: 'Lip tint with a satin finish' },
  { id: 'social-2', src: '/assets/social_pic2.png', alt: 'Textured faux fur jacket selfie' },
  { id: 'social-3', src: '/assets/social_pic3.png', alt: 'Glossy lips with product close up' },
  { id: 'social-4', src: '/assets/social_pic1.png', alt: 'Lip tint swatch in hand' },
  { id: 'social-5', src: '/assets/social_pic2.png', alt: 'Burgundy outfit mirror selfie' },
  { id: 'social-6', src: '/assets/social_pic3.png', alt: 'Lip oil and phone detail' },
]
const SOCIAL_TITLE_COPY = 'we love @tomijewelry on you'

export function Social() {
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const [typingIndex, setTypingIndex] = React.useState(0)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const typedText = SOCIAL_TITLE_COPY.slice(0, typingIndex)

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
            <div className="social-track" ref={trackRef}>
              {socialSlides.map((slide) => (
                <div key={slide.id} className="social-slide" data-slide>
                  <Image src={slide.src} alt={slide.alt} fill sizes="(min-width: 1024px) 220px, (min-width: 768px) 45vw, 72vw" className="social-slide-media" priority={slide.id === 'social-1'} />
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

