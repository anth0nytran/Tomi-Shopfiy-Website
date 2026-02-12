import React from 'react'
import Link from 'next/link'

export function AnnouncementBar() {
  return (
    <Link href="/shop" className="announcement-bar" data-section-type="announcement">
      <p className="announcement-text">
        LUNAR NEW YEAR CHARMS PRE-ORDER OPENS FRIDAY, FEBRUARY 13TH.
      </p>
    </Link>
  )
}

