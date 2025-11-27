"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SmoothScrollHero from '@/components/ui/smooth-scroll-hero'
import { Lens } from '@/components/ui/magnifier-lens'
import { Section3DTransition } from '@/components/ui/Section3DTransition'
import { AnimatePresence, motion } from 'framer-motion'

type HighlightTile = {
  id: string
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
  href: string
  image: { src: string; alt: string }
  imageFirst?: boolean
}

export function Vintage() {
  const spotlights: HighlightTile[] = [
    {
      id: 'moonlight',
      eyebrow: 'OUR BEST SELLING COLLECTION',
      title: 'Moonlight',
      body: 'Soft jade tones with a luminous finish for every stack.',
      ctaLabel: 'shop collection',
      href: '/shop/category/moonlight',
      image: { src: '/assets/moonstone.jpeg', alt: 'Moonlight collection rings' },
      imageFirst: true,
    },
    {
      id: 'flutter',
      eyebrow: 'DAINTY AND ETHEREAL',
      title: 'Flutter',
      body: 'Airy silhouettes that float over skin like light.',
      ctaLabel: 'shop collection',
      href: '/shop/category/flutter',
      image: { src: '/assets/flutter.png', alt: 'Flutter layered necklace' },
      imageFirst: false,
    },
    {
      id: 'refine',
      eyebrow: 'CLASSIC AND TIMELESS',
      title: 'Refine',
      body: 'Streamlined pieces designed to polish your everyday look.',
      ctaLabel: 'shop collection',
      href: '/shop/category/refined',
      image: { src: '/assets/refine.jpg', alt: 'Refine collection hoops' },
      imageFirst: true,
    },
    {
      id: 'embellish',
      eyebrow: 'ADORN YOURSELF',
      title: 'Embellish',
      body: 'Mix-and-match accents that invite endless layering.',
      ctaLabel: 'shop collection',
      href: '/shop/category/embellish',
      image: { src: '/assets/embellish.jpg', alt: 'Embellish collection display' },
      imageFirst: false,
    },
    {
      id: 'one-of-a-kind',
      eyebrow: 'VINTAGE PIECES',
      title: 'One Of A Kind',
      body: 'Hand-curated heirlooms—once they’re gone, they’re gone.',
      ctaLabel: 'shop collection',
      href: '/shop/category/one-of-a-kind-vintage',
      image: { src: '/assets/1kind.jpg', alt: 'One of a kind vintage watches' },
      imageFirst: true,
    },
  ]

  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const totalSpotlights = spotlights.length
  const timer = useRef<number | null>(null)

  const scheduleNext = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setDirection(1)
      setSpotlightIndex((i) => (i + 1) % totalSpotlights)
    }, 6500)
  }, [totalSpotlights])

  useEffect(() => {
    scheduleNext()
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [scheduleNext])

  const activeSpotlight = useMemo(() => spotlights[spotlightIndex], [spotlightIndex, spotlights])

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 55 : -55,
      z: -90,
      scale: 0.92,
      filter: 'blur(10px)',
      transition: { duration: 0.95, ease: [0.4, 0, 0.2, 1] },
    }),
    center: {
      opacity: 1,
      x: 0,
      z: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.25, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -55 : 55,
      z: -60,
      scale: 0.94,
      filter: 'blur(8px)',
      transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
    }),
  }

  const heroOverlay = (
    <div className="flex flex-col items-center gap-5 text-center text-white">
      <h3 className="font-heading text-[clamp(3rem,6vw,5rem)] leading-tight drop-shadow-lg text-white">
        discover tomi jewelry
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {[
          { href: '/shop/best-sellers', label: 'best sellers' },
          { href: '/jade-bar', label: 'jade jewelry' },
          { href: '/shop/new-arrivals', label: 'new arrivals' },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="rounded-full border border-white/60 bg-white/15 px-6 py-2 text-[0.7rem] uppercase tracking-[0.35em] text-white transition hover:bg-white hover:text-black"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setSpotlightIndex((idx) => (idx - 1 + totalSpotlights) % totalSpotlights)
    scheduleNext()
  }, [scheduleNext, totalSpotlights])

  const handleNext = useCallback(() => {
    setDirection(1)
    setSpotlightIndex((idx) => (idx + 1) % totalSpotlights)
    scheduleNext()
  }, [scheduleNext, totalSpotlights])

  return (
    <>
      {/* <section id="vintage" className="section section--vintage-collage" data-section-type="vintage" data-anim="fade-in" data-delay="0">
        <div className="container vintage-collage">
          <aside className="vintage-aside" data-anim="slide-left" data-delay="80">
            <h2 className="vintage-title">
              <span className="vintage-title-line">add your story</span>
              <span className="vintage-title-line">to a vintage piece</span>
            </h2>
            <Link href="/shop/category/one-of-a-kind-vintage" className="vintage-link" aria-label="Shop our vintage collection">
              shop the collection
            </Link>
          </aside>

          <div className="vintage-canvas" aria-live="polite">
            {images.map((img, i) => (
              <figure key={i} className={`vintage-slide${i === index ? ' is-active' : ''}`} aria-hidden={i !== index}>
                <Image src={img.src} alt={img.alt} width={800} height={800} />
              </figure>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section className="section section--vintage-lens" data-anim="fade-in" data-delay="60" aria-label="Vintage magnification detail">
        <div className="container vintage-lens__wrap">
          <div className="vintage-lens__frame">
            <Lens zoomFactor={2.35} lensSize={230}>
              <Image
                src="/assets/jewelry-box.png"
                alt="Velvet jewelry travel case with assorted charms"
                width={1400}
                height={933}
                className="vintage-lens__image"
                priority
              />
            </Lens>
            <Link href="/shop/category/one-of-a-kind-vintage" className="vintage-lens__cta" aria-label="Find your perfect piece">
              find your perfect piece
            </Link>
          </div>
        </div>
      </section> */}

      <Section3DTransition className="section section--dual-highlight" depth={0} scrollEffect={false}>
        <div className="container dual-highlight__grid" aria-label="14k solid gold highlights" role="region">
          <React.Fragment key={activeSpotlight.id}>
            <>
              <article className="dual-highlight__tile dual-highlight__tile--copy">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`copy-${activeSpotlight.id}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="dual-highlight__content dual-highlight__content--copy"
                  >
                    <p className="dual-highlight__eyebrow">{activeSpotlight.eyebrow}</p>
                    <h3 className="dual-highlight__title">{activeSpotlight.title}</h3>
                    <p className="dual-highlight__body">{activeSpotlight.body}</p>
                    <Link href={activeSpotlight.href} className="dual-highlight__cta" aria-label={activeSpotlight.title}>
                      {activeSpotlight.ctaLabel}
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </article>

              <figure className="dual-highlight__tile dual-highlight__tile--image">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`image-${activeSpotlight.id}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="dual-highlight__image-frame"
                  >
                    <Image
                      src={activeSpotlight.image.src}
                      alt={activeSpotlight.image.alt}
                      fill
                      quality={95}
                      sizes="(max-width: 768px) 100vw, min(48vw, 640px)"
                      className="dual-highlight__image"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </figure>
            </>
          </React.Fragment>
        </div>
      </Section3DTransition>

      {/* <Section3DTransition
        className="section section--dual-highlight"
        depth={320}
      >
        <div
          className="container dual-highlight__grid"
          aria-label="14k solid gold collection highlight"
          role="region"
        >
          <motion.article
            initial={{ opacity: 0, x: -90 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="dual-highlight__tile dual-highlight__tile--copy"
          >
            <p className="dual-highlight__eyebrow">introducing</p>
            <h3 className="dual-highlight__title">14k solid gold collection</h3>
            <p className="dual-highlight__body">Every piece made to last.</p>
            <Link
              href="/shop/category/solid-gold"
              className="dual-highlight__cta"
              aria-label="Shop the 14k solid gold collection"
            >
              shop collection
            </Link>
          </motion.article>

          <motion.figure
            initial={{ opacity: 0, x: 90 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
            className="dual-highlight__tile dual-highlight__tile--image"
          >
            <Image
              src="/assets/discover_jade.png"
              alt="Close up of a 14k gold necklace resting on skin"
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, min(50vw, 640px)"
              className="dual-highlight__image"
              priority={false}
            />
          </motion.figure>
        </div>
      </Section3DTransition> */}

      {/* <section className="section relative bg-transparent py-0" aria-label="Vintage smooth scroll feature">
        <div className="mx-auto w-full">
          <SmoothScrollHero
            scrollHeight={420}
            desktopImage="/assets/discover_jade.png"
            mobileImage="/assets/discover_jade.png"
            initialClipPercentage={45}
            finalClipPercentage={100}
            revealAt={0.6}
            initialBackgroundSize={140}
            finalBackgroundSize={100}
            centerInitialFrame
            overlayContent={heroOverlay}
            overlayRevealStart={0.78}
            freezeOnComplete
            viewportHeight="85vh"
          />
        </div>
      </section> */}

      {/* <section className="section section--jade-highlight" data-section-type="jade-highlight" data-anim="fade-in" data-delay="60">
        <div className="container jade-highlight">
          <div className="jade-highlight__copy" data-anim="slide-left" data-delay="100">
            <p className="jade-highlight__eyebrow">introducing houston&#39;s first</p>
            <h3 className="jade-highlight__title">custom jade bar</h3>
            <p className="jade-highlight__body">
              Curate your own Grade A jade—choose the colorway, chain, and finishing touches—then watch our team craft it
              just for you. It’s a ritual as meaningful as the piece you take home.
            </p>
            <Link className="jade-highlight__cta" href="/jade-bar" aria-label="Visit the Jade Bar experience page">
              plan your visit
            </Link>
          </div>
          <div className="jade-highlight__media" data-anim="slide-right" data-delay="180">
            <Image
              src="/assets/home-jade-feature.png"
              alt="Guests designing their custom jade piece"
              width={920}
              height={680}
              priority
            />
          </div>
        </div>
      </section> */}
    </>
  )
}
