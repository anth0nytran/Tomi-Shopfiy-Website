import React from 'react'
import Link from 'next/link'

export function AnnouncementBar() {
  return (
    <Link href="/shop" className="announcement-bar" data-section-type="announcement">
      <p className="announcement-text">
        BLOOM IN GOLD THIS SPRING WITH OUR PIECES ✿
      </p>
    </Link>
  )
}

