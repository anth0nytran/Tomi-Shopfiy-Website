import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function RepairPage() {
  return (
    <main className="repair-main">
      <AnnouncementBar />
      <Header />

      <section className="repair-hero" aria-label="Repair form">
        <div className="repair-frame">
          <iframe
            className="repair-embed"
            title="Repair Service Form"
            src="https://forms.carouselhq.com/t/kinn-repair-service-form?embed=1"
            allow="clipboard-write; fullscreen"
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
