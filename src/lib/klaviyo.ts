type KlaviyoQueue = Array<unknown>
const FORM_ID = 'YvugMg'
const SESSION_KEY = 'kl_teaser_primed'
const TEASER_PRIME_STYLE_ID = 'kl-teaser-prime-hide'

declare global {
  interface Window {
    _klOnsite?: KlaviyoQueue
  }
}

export function openKlaviyoForm() {
  if (typeof window === 'undefined') return

  if (!window._klOnsite || typeof window._klOnsite.push !== 'function') {
    window._klOnsite = []
  }

  window._klOnsite.push(['openForm', FORM_ID])
}

// Call once per session to let Klaviyo render the built-in teaser without needing a manual CTA first.
export function primeKlaviyoTeaserOnce() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  if (sessionStorage.getItem(SESSION_KEY)) return

  const queue = (window._klOnsite && typeof window._klOnsite.push === 'function')
    ? window._klOnsite
    : (window._klOnsite = [])

  ensureHideStyle()
  queue.push(['openForm', FORM_ID])
  queue.push(['closeForm', FORM_ID])
  sessionStorage.setItem(SESSION_KEY, '1')
  setTimeout(removeHideStyle, 600)
}

function ensureHideStyle() {
  if (document.getElementById(TEASER_PRIME_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = TEASER_PRIME_STYLE_ID
  style.textContent = `
    .kl-private-overlay,
    .kl-private-popup,
    .klaviyo-form-dynamic,
    .klaviyo-popup-overlay {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
  `
  document.head.appendChild(style)
}

function removeHideStyle() {
  const style = document.getElementById(TEASER_PRIME_STYLE_ID)
  if (style?.parentNode) {
    style.parentNode.removeChild(style)
  }
}

export {}
