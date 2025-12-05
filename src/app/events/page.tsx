import type { Metadata } from 'next'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { fetchEvents } from '@/lib/events'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Events at Tomi | Tomi Jewelry',
  description: 'Stay up to date with upcoming happenings at Tomi Jewelry.',
}

export const revalidate = 0

export default async function EventsPage() {
  const events = await fetchEvents()
  const flaggedFeatured = events.find((event) => event.isFeatured)
  const featuredEvent = flaggedFeatured ?? events[0]
  const upcomingEvents = featuredEvent ? events.filter((event) => event.id !== featuredEvent.id) : events
  
  const heroTag = process.env.NEXT_PUBLIC_EVENTS_HERO_TAG ?? 'Events at Tomi'
  const heroHeading = process.env.NEXT_PUBLIC_EVENTS_HERO_HEADING ?? 'Join us in the studio'
  const fallbackSubhead = process.env.NEXT_PUBLIC_EVENTS_HERO_FALLBACK ?? 'Wellness sessions, trunk shows, and collector previews all season.'
  const upcomingLabel = process.env.NEXT_PUBLIC_EVENTS_UPCOMING_LABEL ?? 'On the calendar'
  const heroSubhead = featuredEvent ? `Next up: ${featuredEvent.title}` : fallbackSubhead

  return (
    <main className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/events_header.png"
              alt="Events at Tomi"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 px-6 max-w-4xl mx-auto text-center text-white">
            <span className="block text-xs font-bold tracking-[0.2em] uppercase mb-6 text-white/90 drop-shadow-md">
              {heroTag}
            </span>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl mb-8 leading-none text-white drop-shadow-lg">
              {heroHeading}
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto text-balance text-white/95 drop-shadow-md">
              {heroSubhead}
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-24">
          
          {/* Featured Event */}
          {featuredEvent && (
            <section className="mb-32">
              <div className="flex flex-col md:flex-row bg-white rounded-sm overflow-hidden shadow-sm border border-stone-100">
                {/* Image Side (if event has image, otherwise pattern/color) */}
                <div className="w-full md:w-1/2 min-h-[400px] relative bg-stone-200">
                  {featuredEvent.image ? (
                    <Image 
                      src={featuredEvent.image} 
                      alt={featuredEvent.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#efdada]/30">
                      <span className="font-heading text-4xl text-stone-300">tomi</span>
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
                    Featured Event
                  </span>
                  <h2 className="font-heading text-4xl md:text-5xl text-stone-900 mb-6">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-stone-600 font-light leading-relaxed mb-10">
                    {featuredEvent.description}
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-baseline border-b border-stone-100 pb-3">
                      <span className="w-24 text-xs font-bold uppercase tracking-widest text-stone-400">When</span>
                      <span className="text-stone-900 font-medium">
                        {featuredEvent.weekdayLabel && `${featuredEvent.weekdayLabel}, `}{featuredEvent.dateLabel} @ {featuredEvent.time}
                      </span>
                    </div>
                    <div className="flex items-baseline border-b border-stone-100 pb-3">
                      <span className="w-24 text-xs font-bold uppercase tracking-widest text-stone-400">Where</span>
                      <span className="text-stone-900 font-medium">{featuredEvent.location}</span>
                    </div>
                  </div>

                  {featuredEvent.link && (
                    <div>
                      <a 
                        href={featuredEvent.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors"
                      >
                        RSVP Now
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Upcoming Events List */}
          <section>
            <div className="text-center mb-16">
              <h3 className="font-heading text-3xl md:text-4xl text-stone-900 mb-4">
                {upcomingLabel}
              </h3>
              <div className="h-px w-16 bg-stone-300 mx-auto" />
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-20 bg-white border border-stone-100 rounded-sm">
                <p className="text-stone-500 font-light italic">
                  We are finalizing our calendar. Please check back shortly.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {upcomingEvents.map((event) => (
                  <article key={event.id} className="group bg-white p-8 md:p-10 border border-stone-100 hover:border-stone-300 transition-colors flex flex-col md:flex-row gap-8 md:items-center">
                    
                    {/* Date Block */}
                    <div className="flex-shrink-0 w-full md:w-48 flex flex-row md:flex-col items-baseline md:items-start gap-2 md:gap-1 border-b md:border-b-0 md:border-r border-stone-100 pb-4 md:pb-0 md:pr-8">
                      <span className="text-3xl md:text-4xl font-heading text-stone-900">{event.dateLabel?.split(' ')[0] || 'TBD'}</span> {/* Assumes date starts with Day number or similar, simplified for visual */}
                      <div className="flex flex-col">
                         <span className="text-xs font-bold uppercase tracking-widest text-primary">{event.weekdayLabel}</span>
                         <span className="text-xs text-stone-500">{event.time}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <h4 className="font-heading text-2xl text-stone-900 mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-stone-600 font-light text-sm leading-relaxed max-w-2xl mb-2">
                        {event.description}
                      </p>
                      <p className="text-xs text-stone-400 uppercase tracking-wider">
                        {event.location}
                      </p>
                    </div>

                    {/* Action */}
                    {event.link && (
                      <div className="flex-shrink-0 pt-4 md:pt-0">
                        <a 
                          href={event.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-900 hover:text-primary transition-colors border-b border-stone-900 pb-1 hover:border-primary"
                        >
                          Details <span aria-hidden="true">&rarr;</span>
                        </a>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>

      <Footer />
    </main>
  )
}
