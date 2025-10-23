import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import FAQ from '@/components/sections/FAQ'

export default function ContactPage() {
  return (
    <main className="contact-main">
      <AnnouncementBar />
      <Header />

      <section className="contact-hero" aria-labelledby="contact-heading">
        <div className="contact-card">
          <h1 id="contact-heading" className="contact-title">CONTACT US</h1>
          <p className="contact-sub">Please don’t hesitate to reach out if you have any questions at all!</p>
          <form className="contact-form">
            <div className="contact-row">
              <input placeholder="Name" className="contact-input" />
              <input placeholder="Email" className="contact-input" />
            </div>
            <input placeholder="Phone number" className="contact-input" />
            <textarea placeholder="Comment" className="contact-textarea" rows={6} />
            <button className="contact-submit" type="submit">SEND MESSAGE</button>
          </form>
        </div>
      </section>

      {/* FAQ below contact */}
      <FAQ />

      <Footer />
    </main>
  )
}
