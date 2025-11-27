import type { Metadata } from 'next'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { fetchEvents } from '@/lib/events'

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
  const heroTag = process.env.NEXT_PUBLIC_EVENTS_HERO_TAG ?? 'events at tomi'
  const heroHeading = process.env.NEXT_PUBLIC_EVENTS_HERO_HEADING ?? 'Join us in the studio'
  const fallbackSubhead =
    process.env.NEXT_PUBLIC_EVENTS_HERO_FALLBACK ??
    'Wellness sessions, trunk shows, and collector previews all season.'
  const upcomingLabel = process.env.NEXT_PUBLIC_EVENTS_UPCOMING_LABEL ?? 'events'
  const upcomingHeading = process.env.NEXT_PUBLIC_EVENTS_UPCOMING_HEADING ?? 'On the calendar'
  const heroSubhead = featuredEvent ? `Next up: ${featuredEvent.title}` : fallbackSubhead

  return (
    <main className="events-main">
      <AnnouncementBar />
      <Header />

      <section className="events-hero" aria-labelledby="events-hero-heading" data-anim="fade-in">
        <div
          className="events-hero-media"
          role="img"
          aria-label="Guests gathering for a Tomi community experience"
        >
          <div className="events-hero-overlay">
            <div className="events-hero-text">
              <p className="events-hero-tag">{heroTag}</p>
              <h1 id="events-hero-heading">{heroHeading}</h1>
              <p className="events-hero-copy">{heroSubhead}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="events-content">
        {featuredEvent ? (
          <article className="events-featured-card" aria-labelledby="featured-event-title" data-anim="slide-up">
            <div className="events-featured-top">
              <div className="events-featured-info">
                <p className="events-featured-label">featured event</p>
                <h2 id="featured-event-title">{featuredEvent.title}</h2>
                <p className="events-featured-description">{featuredEvent.description}</p>
              </div>
              <dl className="events-featured-dateblock">
                {featuredEvent.weekdayLabel ? (
                  <div className="events-featured-dategroup">
                    <dt className="sr-only">Day</dt>
                    <dd className="events-featured-weekday">{featuredEvent.weekdayLabel}</dd>
                  </div>
                ) : null}
                <div className="events-featured-dategroup">
                  <dt className="sr-only">Date</dt>
                  <dd className="events-featured-datevalue">{featuredEvent.dateLabel}</dd>
                </div>
                <div className="events-featured-dategroup">
                  <dt className="sr-only">Time</dt>
                  <dd className="events-featured-time">{featuredEvent.time}</dd>
                </div>
                <div className="events-featured-dategroup">
                  <dt className="sr-only">Location</dt>
                  <dd className="events-featured-location">{featuredEvent.location}</dd>
                </div>
              </dl>
            </div>
            {featuredEvent.link ? (
              <a href={featuredEvent.link} className="events-featured-link" target="_blank" rel="noreferrer">
                View details<span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </article>
        ) : null}

        <section className="events-upcoming" aria-labelledby="events-upcoming-heading" data-anim="fade-in">
          <p className="events-upcoming-label">{upcomingLabel}</p>
          <h2 id="events-upcoming-heading">{upcomingHeading}</h2>
          {upcomingEvents.length === 0 ? (
            <div className="events-empty">
              <p>We are finalizing our calendar. Please check back shortly.</p>
            </div>
          ) : (
            <div className="events-list">
              {upcomingEvents.map((event) => (
                <article key={event.id} className="event-row">
                  <div className="event-row-date">
                    {event.weekdayLabel ? <span className="event-row-day">{event.weekdayLabel}</span> : null}
                    <span className="event-row-datevalue">{event.dateLabel}</span>
                    <span className="event-row-time">{event.time}</span>
                    <span className="event-row-location">{event.location}</span>
                  </div>
                  <div
                    className="event-row-media"
                    aria-hidden="true"
                    data-has-image={Boolean(event.image)}
                    style={event.image ? { backgroundImage: `url(${event.image})` } : undefined}
                  />
                  <div className="event-row-content">
                    <p className="event-row-title">{event.title}</p>
                    <p className="event-row-description">{event.description}</p>
                    {event.link ? (
                      <a href={event.link} className="event-row-link" target="_blank" rel="noreferrer">
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  )
}

