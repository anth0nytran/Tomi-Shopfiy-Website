"use client"
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/sections/Hero'
import { Categories } from '@/components/sections/Categories'
import { MissionBanner } from '@/components/sections/MissionBanner'
import { Vintage } from '@/components/sections/Vintage'
import { Values } from '@/components/sections/Values'
import { Social } from '@/components/sections/Social'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <Hero />
      <Categories />
      <MissionBanner />
      <Vintage />
      <Values />
      <Social />
      <Footer />
    </main>
  )
}
