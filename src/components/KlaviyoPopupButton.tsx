"use client"

import { openKlaviyoForm } from '@/lib/klaviyo'

export function KlaviyoPopupButton() {
  return (
    <button
      type="button"
      onClick={openKlaviyoForm}
      className="fixed bottom-6 right-6 z-[60] rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      Join the list
    </button>
  )
}
