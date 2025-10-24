// Global state to track if listeners have been attached
let _initialized = false
const rootVarState: Record<string, string> = {}

function ensureVarStyleEl(): HTMLStyleElement {
  let el = document.getElementById('tomi-root-vars') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = 'tomi-root-vars'
    document.head.appendChild(el)
  }
  return el
}

function setRootVar(name: string, value: string) {
  if (rootVarState[name] === value) return
  rootVarState[name] = value
  const el = ensureVarStyleEl()
  const body = Object.entries(rootVarState)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ')
  el.textContent = `:root { ${body} }`
}

function setInitialHeaderVars(){
  try {
    const bar = document.querySelector('.announcement-bar') as HTMLElement | null
    const header = document.querySelector('.header') as HTMLElement | null
    const bh = bar ? Math.round(bar.getBoundingClientRect().height) : 44
    const hh = header ? Math.round(header.getBoundingClientRect().height) : 72
    setRootVar('--header-top', `${bh}px`)
    setRootVar('--header-offset', `${bh + hh + 2}px`)
  } catch {}
}

export function initClientBehaviors() {
  // Always sync header vars on call
  setInitialHeaderVars()
  
  // Skip listener setup if already initialized
  if (_initialized) return
  _initialized = true
  // Reveal animations in sync per section/group
  const revealedGroups = new WeakSet<Element>()

  function getGroupContainer(el: Element): Element {
    // Prefer nearest section-like container
    return (
      (el as HTMLElement).closest('section, .section, [role="region"]') ||
      (el.parentElement as Element)
    )
  }

  function revealGroup(container: Element) {
    if (revealedGroups.has(container)) return
    revealedGroups.add(container)
    container.querySelectorAll('[data-anim]').forEach((child) => {
      (child as HTMLElement).classList.add('animate')
    })
  }

  const containers = new Set<Element>()
  document.querySelectorAll('[data-anim]').forEach((el) => {
    containers.add(getGroupContainer(el))
  })

  const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) revealGroup(entry.target)
    })
  }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.15 })

  containers.forEach((c) => groupObserver.observe(c))

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
    // Do NOT toggle a global no-scroll class; it causes layout/visibility flicker on client nav
    if (noScroll) {
      header?.classList.add('scrolled')
      header?.classList.remove('announcement-hidden')
      bar?.classList.remove('hidden')
      isHidden = false
    } else {
      header?.classList.remove('announcement-hidden')
      bar?.classList.remove('hidden')
      isHidden = false
    }
    syncHeaderTop()
  }

  function applyHeaderModeByPage() {
    const hasHero = !!document.querySelector('.section--hero')
    document.body.classList.toggle('no-hero', !hasHero)
    document.body.classList.toggle('has-hero', hasHero)
    // If no hero, ensure first section has top padding equal to header offset
    if (!hasHero) {
      const first = document.querySelector('main > .section, main > section') as HTMLElement | null
      if (first) first.style.paddingTop = `calc(var(--header-offset))`
    }
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
        const cartOpen = document.body.classList.contains('cart-open')
        if (!cartOpen && y > 20 && scrollingDown) {
          if (!isHidden) {
            bar.classList.add('hidden')
            header?.classList.add('announcement-hidden')
            document.body.classList.add('announcement-hidden')
            isHidden = true
          }
        } else if (scrollingUp || y <= 10 || cartOpen) {
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
  // Recalculate after all assets load (e.g., images increasing page height)
  window.addEventListener('load', () => {
    applyNoScrollState()
    applyHeaderModeByPage()
    syncHeaderTop()
  })
  // Observe size changes in main content to re-evaluate scrollability
  const ro = new ResizeObserver(() => {
    applyNoScrollState()
    syncHeaderTop()
  })
  const mainEl = document.querySelector('main') as HTMLElement | null
  if (mainEl) ro.observe(mainEl)
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
    setRootVar('--header-top', `${barHeight}px`)
    // Also sync full header offset (announcement + header height) to stabilize layout/min-heights
    const headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 72
    setRootVar('--header-offset', `${barHeight + headerHeight}px`)
    if (document.body.classList.contains('cart-open')) {
      const top = computeHeaderBottom()
      setRootVar('--cart-panel-top', `${top}px`)
    }
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
  // Use event delegation so triggers continue to work across route changes/remounts
  const closersLive = () => Array.from(document.querySelectorAll('[data-cart-close]')) as HTMLElement[]
  const cartBody = document.getElementById('cart-body') as HTMLElement | null
  const cartFooter = document.getElementById('cart-footer') as HTMLElement | null

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
    setRootVar('--cart-panel-top', `${top}px`)
    document.body.classList.add('cart-open')
    cartDrawer.setAttribute('aria-hidden', 'false')
    // force reflow to ensure CSS transition kicks in if needed
    if (cartPanel) void cartPanel.offsetHeight
    cartDrawer.classList.add('is-open')
    // Inline transform guarantees visibility even if a stylesheet override wins
    if (cartPanel) cartPanel.style.transform = 'translateX(0)'
    // Load current cart contents when opening
    renderCart()
  }
  function closeCart() {
    if (!cartDrawer) return
    cartDrawer.setAttribute('aria-hidden', 'true')
    cartDrawer.classList.remove('is-open')
    if (cartPanel) cartPanel.style.transform = ''
    document.body.classList.remove('cart-open')
  }
  // Global delegated opener (bind once)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const opener = target?.closest('[data-cart-trigger]') as HTMLElement | null
    if (opener) { e.preventDefault(); openCart() }
  }, { capture: false })
  // Allow programmatic open from React components after adding to cart
  document.addEventListener('tomi:cart:open', () => openCart())
  // Bind current and future closers
  closersLive().forEach((btn) => btn.addEventListener('click', closeCart))
  cartDrawer?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('cart-drawer-backdrop')) closeCart()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart()
  })

  async function fetchCart() {
    try {
      const res = await fetch('/api/cart', { cache: 'no-store' })
      if (!res.ok) return null
      return await res.json()
    } catch { return null }
  }

  function formatMoney(amount: number, currency: string) {
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount) } catch { return `$${amount.toFixed(2)}` }
  }

  function setCheckoutUrl(url?: string) {
    const cta = cartFooter?.querySelector('.cart-cta') as HTMLAnchorElement | null
    if (!cta) return
    if (url) {
      cta.href = url
      cta.removeAttribute('aria-disabled')
    } else {
      cta.href = '#'
      cta.setAttribute('aria-disabled', 'true')
    }
  }

  async function renderCart() {
    if (!cartBody) return
    const cart = await fetchCart()
    if (!cart || !cart?.lines?.edges?.length) {
      cartBody.innerHTML = '<p class="cart-empty">Your bag is empty.</p>'
      if (cartFooter) cartFooter.querySelector('.cart-summary span:last-child')!.textContent = '$0.00'
      setCheckoutUrl(undefined)
      return
    }
    const itemsHtml = cart.lines.edges.map((edge: any) => {
      const n = edge.node
      const p = n.merchandise?.product
      const img = p?.images?.edges?.[0]?.node
      const price = n.cost?.subtotalAmount
      return `
        <div class="cart-item" data-line-id="${n.id}">
          <div class="cart-item-media">${img?.url ? `<img src="${img.url}" alt="${img?.altText || ''}" />` : ''}</div>
          <div class="cart-item-info">
            <div class="cart-item-title">${p?.title || ''}</div>
            <div class="cart-item-sub">Qty ${n.quantity}</div>
          </div>
          <div class="cart-item-price">${price ? formatMoney(parseFloat(price.amount), price.currencyCode) : ''}</div>
          <button class="cart-item-remove" aria-label="Remove item" data-remove-line="${n.id}" title="Remove">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
      `
    }).join('')
    cartBody.innerHTML = itemsHtml
    if (cartFooter) {
      const sub = cart.cost?.subtotalAmount
      cartFooter.querySelector('.cart-summary span:last-child')!.textContent = sub ? formatMoney(parseFloat(sub.amount), sub.currencyCode) : '$0.00'
    }
    setCheckoutUrl(cart.checkoutUrl)
    // Bind remove handlers
    cartBody.querySelectorAll('[data-remove-line]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const lineId = (e.currentTarget as HTMLElement).getAttribute('data-remove-line')
        if (!lineId) return
        try {
          const res = await fetch('/api/cart/lines', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lineIds: [lineId] }) })
          if (res.ok) {
            await renderCart()
          }
        } catch {}
      })
    })
  }
}
