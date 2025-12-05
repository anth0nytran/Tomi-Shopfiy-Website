import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/sections/Hero'
import { Categories } from '@/components/sections/Categories'
import { JewelryBoxReveal } from '@/components/sections/JewelryBoxReveal'
import { MissionBanner } from '@/components/sections/MissionBanner'
import { Vintage } from '@/components/sections/Vintage'
import { Values } from '@/components/sections/Values'
import { Social } from '@/components/sections/Social'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <div className="flex-1 w-full">
        <Hero />
        <Categories />
        <JewelryBoxReveal />
        <Vintage />
        <MissionBanner />
        <Values />
        <Social />
      </div>
      <Footer />
    </main>
  )
}
