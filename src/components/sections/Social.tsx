'use client'

import React from 'react'
import Image from 'next/image'

// Fallback local slides in case remote fetch fails
const FALLBACK_SLIDES = [
  { id: 'social-1', src: '/assets/social_pic1.png', alt: 'Social highlight 1' },
  { id: 'social-2', src: '/assets/social_pic2.png', alt: 'Social highlight 2' },
  { id: 'social-3', src: '/assets/social_pic3.png', alt: 'Social highlight 3' },
]

const SHEET_CSV =
  'https://docs.google.com/spreadsheets/d/1_9w5PvPW67LbDN2rqu8wuGDgnIaoRW8Fos_zdgo2x7c/export?format=csv'

const driveDirectUrl = (url: string) => {
  // Accept full Drive links like https://drive.google.com/file/d/<id>/view?... or ...?id=<id>
  const idMatch = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/)
  if (!idMatch) return url
  return `https://drive.google.com/uc?id=${idMatch[1]}`
}

type Slide = { id: string; src: string; alt: string }
const SOCIAL_TITLE_COPY = 'we love @tomijewelry on you'

export function Social() {
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const [typingIndex, setTypingIndex] = React.useState(0)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const typedText = SOCIAL_TITLE_COPY.slice(0, typingIndex)
  const [slides, setSlides] = React.useState<Slide[]>(FALLBACK_SLIDES)

  // Fetch Google Sheet CSV and map drive links to direct image URLs
  React.useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(SHEET_CSV)
        if (!res.ok) throw new Error('Failed to fetch sheet')
        const text = await res.text()
        const rows = text.trim().split(/\r?\n/)
        if (!rows.length) return
        const headers = rows[0].split(',').map((h) => h.trim().toLowerCase())
        const srcIdx = headers.findIndex((h) => h === 'src' || h === 'url' || h === 'image')
        const altIdx = headers.findIndex((h) => h === 'alt' || h === 'caption' || h === 'description')
        if (srcIdx === -1) return

        const mapped: Slide[] = rows.slice(1).map((row, i) => {
          const cols = row.split(',')
          const rawSrc = cols[srcIdx]?.trim() || ''
          const alt = altIdx !== -1 ? cols[altIdx]?.trim() || 'Social highlight' : 'Social highlight'
          return {
            id: `social-remote-${i + 1}`,
            src: driveDirectUrl(rawSrc),
            alt,
          }
        })

        const valid = mapped.filter((s) => s.src)
        if (valid.length) setSlides(valid)
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
              {slides.map((slide, idx) => (
                <div key={slide.id} className="social-slide" data-slide>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 768px) 45vw, 72vw"
                    className="social-slide-media"
                    priority={idx === 0}
                    unoptimized
                  />
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

