import React from 'react'
import Link from 'next/link'

export function AnnouncementBar() {
  return (
    <Link href="/shop" className="announcement-bar" data-section-type="announcement">
      <p className="announcement-text">
        our sweetheart collection is now live! find something you adore
      </p>
    </Link>
  )
}

