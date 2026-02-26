import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const JadeBarBuilder = dynamic(() => import('@/components/jade-bar/JadeBarBuilder'), {
    ssr: false,
})

export const metadata: Metadata = {
    title: 'Build Your Custom Jade Piece | Tomi Jade Bar',
    description:
        'Design your own custom jade necklace or bracelet. Choose your chain, bail, jade stone, and more at the Tomi Jade Bar.',
}

export default function JadeBarBuilderPage() {
    return (
        <main className="bg-[#F9F8F6] flex flex-col">
            <AnnouncementBar />
            <Header />
            <div className="flex-1" style={{ paddingTop: 'var(--header-offset, 120px)' }}>
                <JadeBarBuilder />
            </div>
        </main>
    )
}
