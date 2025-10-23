export function initClientBehaviors() {
  // Reveal elements with data-anim on load and scroll
  const animated = new Set<Element>()

  function reveal(el: Element) {
    if (animated.has(el)) return
    animated.add(el)
    const delayAttr = (el as HTMLElement).getAttribute('data-delay')
    const delay = delayAttr ? parseInt(delayAttr, 10) : 0
    window.setTimeout(() => (el as HTMLElement).classList.add('animate'), isNaN(delay) ? 0 : delay)
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) reveal(entry.target)
    })
  }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.1 })

  document.querySelectorAll('[data-anim]').forEach((el) => io.observe(el))
  // Ensure hero subtext is visible immediately (pre-reveal) to avoid missing content until scroll
  document.querySelectorAll('.hero-subtitle, .hero-cta, .hero-caption').forEach((el) => {
    (el as HTMLElement).classList.add('animate')
  })

  // Header + announcement hide on scroll
  const header = document.querySelector('.header') as HTMLElement | null
  const bar = document.querySelector('.announcement-bar') as HTMLElement | null
  let isHidden = false

  function isPageScrollable() {
    const doc = document.documentElement
    return doc.scrollHeight > (window.innerHeight + 4)
  }

  function applyNoScrollState() {
    const noScroll = !isPageScrollable()
    document.body.classList.toggle('no-scroll', noScroll)

    if (noScroll) {
      // Stabilize header/announcement when there is nothing to scroll
      header?.classList.add('scrolled', 'announcement-hidden')
      if (bar) bar.classList.add('hidden')
      isHidden = true
    } else {
      // Restore baseline; scrolling handler will adjust classes further
      header?.classList.remove('announcement-hidden')
      if (bar) bar.classList.remove('hidden')
      isHidden = false
      onScroll()
    }
    syncHeaderTop()
  }

  function applyHeaderModeByPage() {
    const hasHero = !!document.querySelector('.section--hero')
    document.body.classList.toggle('no-hero', !hasHero)
    document.body.classList.toggle('has-hero', hasHero)
  }
  // Smooth, direction-aware scroll handler to avoid sticky/hanging states on mobile
  let lastY = window.scrollY
  let ticking = false
  function onScroll() {
    const run = () => {
      const y = Math.max(0, window.scrollY)
      const dy = y - lastY
      const scrollingDown = dy > 2
      const scrollingUp = dy < -2

      if (bar) {
        // Hide when scrolling down; show when scrolling up or near top
        if (y > 20 && scrollingDown) {
          if (!isHidden) {
            bar.classList.add('hidden')
            header?.classList.add('announcement-hidden')
            document.body.classList.add('announcement-hidden')
            isHidden = true
          }
        } else if (scrollingUp || y <= 10) {
          if (isHidden) {
            // remove hidden first so bar slides down; set header-top immediately to prevent overlap
            bar.classList.remove('hidden')
            document.body.classList.remove('announcement-hidden')
            header?.classList.remove('announcement-hidden')
            syncHeaderTop()
            isHidden = false
          }
        }
      }
      if (header) {
        if (y > 8) header.classList.add('scrolled')
        else header.classList.remove('scrolled')
        syncHeaderTop()
      }
      lastY = y
      ticking = false
    }
    if (!ticking) {
      ticking = true
      window.requestAnimationFrame(run)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', () => {
    // Throttle via rAF for resize bursts
    window.requestAnimationFrame(() => {
      applyNoScrollState()
      applyHeaderModeByPage()
      syncHeaderTop()
    })
  })
  applyNoScrollState()
  applyHeaderModeByPage()
  syncHeaderTop()

  // Re-run layout logic on client-side route changes (Next.js app router)
  function onRouteChange() {
    // Allow DOM to settle
    window.requestAnimationFrame(() => {
      applyNoScrollState()
      applyHeaderModeByPage()
      // Reset scroll state to avoid stuck bars after soft navigation
      lastY = window.scrollY
      isHidden = false
      bar?.classList.remove('hidden')
      header?.classList.remove('announcement-hidden')
      syncHeaderTop()
    })
  }

  function syncHeaderTop() {
    const hidden = document.body.classList.contains('announcement-hidden') || bar?.classList.contains('hidden')
    const barHeight = bar && !hidden ? Math.round(bar.getBoundingClientRect().height) : 0
    document.documentElement.style.setProperty('--header-top', `${barHeight}px`)
  }
  // Patch history APIs to detect navigation
  ;(() => {
    const dispatch = () => window.dispatchEvent(new Event('locationchange'))
    const push = history.pushState
    history.pushState = function (...args: any[]) {
      // @ts-ignore
      const ret = push.apply(this, args)
      dispatch()
      return ret
    }
    const replace = history.replaceState
    history.replaceState = function (...args: any[]) {
      // @ts-ignore
      const ret = replace.apply(this, args)
      dispatch()
      return ret
    }
    window.addEventListener('popstate', dispatch)
  })()
  window.addEventListener('locationchange', onRouteChange)

  // Cart drawer interactions
  const cartDrawer = document.querySelector('.cart-drawer') as HTMLElement | null
  const cartPanel = document.querySelector('[data-cart-panel]') as HTMLElement | null
  const openers = Array.from(document.querySelectorAll('[data-cart-trigger]')) as HTMLElement[]
  const closersLive = () => Array.from(document.querySelectorAll('[data-cart-close]')) as HTMLElement[]

  function computeHeaderBottom(): number {
    const headerEl = document.querySelector('.header') as HTMLElement | null
    if (!headerEl) return 84
    const rect = headerEl.getBoundingClientRect()
    // rect.bottom is relative to viewport; add scrollY to get absolute
    return Math.max(72, Math.round(rect.bottom))
  }

  function openCart() {
    if (!cartDrawer) return
    const top = computeHeaderBottom()
    document.documentElement.style.setProperty('--cart-panel-top', `${top}px`)
    cartDrawer.setAttribute('aria-hidden', 'false')
    // force reflow to ensure CSS transition kicks in if needed
    if (cartPanel) void cartPanel.offsetHeight
    cartDrawer.classList.add('is-open')
    // Inline transform guarantees visibility even if a stylesheet override wins
    if (cartPanel) cartPanel.style.transform = 'translateX(0)'
  }
  function closeCart() {
    if (!cartDrawer) return
    cartDrawer.setAttribute('aria-hidden', 'true')
    cartDrawer.classList.remove('is-open')
    if (cartPanel) cartPanel.style.transform = ''
  }
  openers.forEach((btn) => btn.addEventListener('click', openCart))
  // Bind current and future closers
  closersLive().forEach((btn) => btn.addEventListener('click', closeCart))
  cartDrawer?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('cart-drawer-backdrop')) closeCart()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart()
  })
}
