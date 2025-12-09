// Keeps track of whether global listeners already exist
let _initialized = false

const rootVarState: Record<string, string> = {}
const revealedGroups = new WeakSet<Element>()

let headerEl: HTMLElement | null = null
let announcementEl: HTMLElement | null = null
let mainEl: HTMLElement | null = null
let cartDrawerEl: HTMLElement | null = null
let cartPanelEl: HTMLElement | null = null
let cartBodyEl: HTMLElement | null = null
let cartFooterEl: HTMLElement | null = null

const CART_CACHE_KEY = 'tomi:last-cart'

type CartNoticeTone = 'info' | 'warning' | 'error'
type CartNotice = { message: string; tone?: CartNoticeTone }
type RenderCartOptions = { notices?: CartNotice[] }

let headerResizeObserver: ResizeObserver | null = null
let announcementResizeObserver: ResizeObserver | null = null
let mainResizeObserver: ResizeObserver | null = null
let animationObserver: IntersectionObserver | null = null
let animationContainers: Element[] = []
let jadeTimelineObserver: IntersectionObserver | null = null

let lastAnnouncementHeight = 44
let lastHeaderHeight = 72

let isHidden = false
let lastY = 0
let ticking = false

// Transition tracking
let headerTransitionRaf: number | null = null

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

function stopHeaderTransitionLoop() {
  if (headerTransitionRaf) {
    cancelAnimationFrame(headerTransitionRaf)
    headerTransitionRaf = null
  }
}

function startHeaderTransitionLoop() {
  stopHeaderTransitionLoop()
  const loop = () => {
    syncHeaderVars()
    headerTransitionRaf = requestAnimationFrame(loop)
  }
  loop()
}

const onHeaderTransitionStart = () => startHeaderTransitionLoop()
const onHeaderTransitionEnd = () => stopHeaderTransitionLoop()

function refreshDomRefs() {
  const newHeader = document.querySelector('.header') as HTMLElement | null
  
  // Re-attach listeners if header element changed
  if (headerEl && headerEl !== newHeader) {
     headerEl.removeEventListener('transitionstart', onHeaderTransitionStart)
     headerEl.removeEventListener('transitionrun', onHeaderTransitionStart)
     headerEl.removeEventListener('transitionend', onHeaderTransitionEnd)
     headerEl.removeEventListener('transitioncancel', onHeaderTransitionEnd)
  }
  
  headerEl = newHeader
  announcementEl = document.querySelector('.announcement-bar') as HTMLElement | null
  mainEl = document.querySelector('main') as HTMLElement | null
  cartDrawerEl = document.querySelector('.cart-drawer') as HTMLElement | null
  cartPanelEl = document.querySelector('[data-cart-panel]') as HTMLElement | null
  cartBodyEl = document.getElementById('cart-body') as HTMLElement | null
  cartFooterEl = document.getElementById('cart-footer') as HTMLElement | null

  if (headerEl) {
     headerEl.addEventListener('transitionstart', onHeaderTransitionStart)
     headerEl.addEventListener('transitionrun', onHeaderTransitionStart)
     headerEl.addEventListener('transitionend', onHeaderTransitionEnd)
     headerEl.addEventListener('transitioncancel', onHeaderTransitionEnd)
  }

  if (typeof ResizeObserver === 'undefined') return

  if (!headerResizeObserver) {
    headerResizeObserver = new ResizeObserver(() => syncHeaderVars())
  }
  headerResizeObserver.disconnect()
  if (headerEl) headerResizeObserver.observe(headerEl)

  if (!announcementResizeObserver) {
    announcementResizeObserver = new ResizeObserver(() => syncHeaderVars())
  }
  announcementResizeObserver.disconnect()
  if (announcementEl) announcementResizeObserver.observe(announcementEl)

  if (!mainResizeObserver) {
    mainResizeObserver = new ResizeObserver(() => {
      applyNoScrollState()
      syncHeaderVars()
    })
  }
  mainResizeObserver.disconnect()
  if (mainEl) mainResizeObserver.observe(mainEl)

  updateCachedHeights(true)
}

function readCartSnapshot() {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(CART_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistCartSnapshot(cart: any | null) {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return
  try {
    if (cart && cart?.lines?.edges?.length) {
      window.sessionStorage.setItem(CART_CACHE_KEY, JSON.stringify(cart))
    } else {
      window.sessionStorage.removeItem(CART_CACHE_KEY)
    }
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

function cartNoticesHtml(notices: CartNotice[]) {
  if (!notices.length) return ''
  return notices
    .map((notice) => `<div class="cart-status cart-status--${notice.tone ?? 'info'}">${notice.message}</div>`)
    .join('')
}

function getGroupContainer(el: Element): Element | null {
  return (
    (el as HTMLElement).closest('section, .section, [role="region"]') ||
    el.parentElement ||
    null
  )
}

function setupAnimationObservers() {
  const containers = new Set<Element>()
  document.querySelectorAll('[data-anim]').forEach((el) => {
    const container = getGroupContainer(el)
    if (container) containers.add(container)
  })

  if (typeof IntersectionObserver === 'undefined') {
    containers.forEach((container) => revealGroup(container))
    animationObserver = null
    animationContainers = Array.from(containers)
    return
  }

  if (!animationObserver) {
    animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) revealGroup(entry.target)
      })
    }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.15 })
  } else {
    animationObserver.disconnect()
  }

  animationContainers = Array.from(containers)
  animationContainers.forEach((container) => animationObserver!.observe(container))
}

function revealGroup(container: Element) {
  if (revealedGroups.has(container)) return
  revealedGroups.add(container)
  container.querySelectorAll('[data-anim]').forEach((child) => {
    (child as HTMLElement).classList.add('animate')
  })
}

function revealVisibleContainers() {
  if (!animationContainers.length) return
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const buffer = viewportHeight * 0.1
  animationContainers.forEach((container) => {
    if (!container.isConnected) return
    const rect = container.getBoundingClientRect()
    if (rect.bottom >= buffer && rect.top <= viewportHeight - buffer) {
      revealGroup(container)
    }
  })
}

function applyHeaderModeByPage() {
  const hasHero = !!document.querySelector('.section--hero')
  document.body.classList.toggle('has-hero', hasHero)
  document.body.classList.toggle('no-hero', !hasHero)

  if (!mainEl) return
  const skipAutoOffset = mainEl.dataset.skipHeaderOffset === 'true'
  mainEl.classList.toggle('skip-header-offset', skipAutoOffset)
}

function applyNoScrollState() {
  // If the mobile menu is open, we shouldn't attempt to show the announcement bar or change header state
  if (document.body.classList.contains('mobile-nav-open')) return

  const doc = document.documentElement
  const scrollable = doc.scrollHeight > (window.innerHeight + 4)

  if (!scrollable) {
    headerEl?.classList.add('scrolled')
    headerEl?.classList.remove('announcement-hidden')
    announcementEl?.classList.remove('hidden')
    document.body.classList.remove('announcement-hidden')
    isHidden = false
  }

  updateCachedHeights()
}

function updateCachedHeights(force = false) {
  if (announcementEl) {
    const rect = announcementEl.getBoundingClientRect()
    const height = Math.round(rect.height)
    if (height > 0 || force) {
      lastAnnouncementHeight = height > 0 ? height : lastAnnouncementHeight
    }
  }
  if (headerEl) {
    const rect = headerEl.getBoundingClientRect()
    const height = Math.max(60, Math.round(rect.height))
    if (height > 0 || force) {
      lastHeaderHeight = height > 0 ? height : lastHeaderHeight
    }
  }
}

function handleScroll() {
  if (ticking) return
  if (document.body.classList.contains('mobile-nav-open')) return
  ticking = true
  window.requestAnimationFrame(() => {
    const y = Math.max(0, window.scrollY)
    const dy = y - lastY
    const scrollingDown = dy > 2
    const scrollingUp = dy < -2
    let needsSync = false

    if (announcementEl) {
      const cartOpen = document.body.classList.contains('cart-open')
      if (!cartOpen && y > 20 && scrollingDown) {
        if (!isHidden) {
          announcementEl.classList.add('hidden')
          document.body.classList.add('announcement-hidden')
          headerEl?.classList.add('announcement-hidden')
          isHidden = true
          needsSync = true
        }
      } else if (isHidden && (scrollingUp || y <= 10 || cartOpen)) {
        announcementEl.classList.remove('hidden')
        document.body.classList.remove('announcement-hidden')
        headerEl?.classList.remove('announcement-hidden')
        isHidden = false
        needsSync = true
      }
    }

    if (headerEl) {
      if (y > 8) headerEl.classList.add('scrolled')
      else headerEl.classList.remove('scrolled')
      needsSync = true
    }

    if (needsSync) syncHeaderVars()
    lastY = y
    ticking = false
  })
}

function syncHeaderVars() {
  updateCachedHeights()
  const hidden = document.body.classList.contains('announcement-hidden') || announcementEl?.classList.contains('hidden')
  const headerTop = hidden ? 0 : lastAnnouncementHeight
  setRootVar('--header-top', `${headerTop}px`)
  
  if (headerEl) {
    const rect = headerEl.getBoundingClientRect()
    // Use actual bottom position for perfect alignment, ensuring no gaps
    setRootVar('--header-offset', `${Math.round(rect.bottom)}px`)
  } else {
    setRootVar('--header-offset', `${headerTop + lastHeaderHeight}px`)
  }

  if (document.body.classList.contains('cart-open')) {
    setRootVar('--cart-panel-top', `${computeHeaderBottom()}px`)
  }
}

function handleResize() {
  window.requestAnimationFrame(() => {
    applyNoScrollState()
    applyHeaderModeByPage()
    syncHeaderVars()
    revealVisibleContainers()
    initJadeTimeline()
  })
}

function handleRouteChange() {
  window.requestAnimationFrame(() => {
    hydrateDom()
    lastY = window.scrollY
    isHidden = false
    document.body.classList.remove('announcement-hidden')
    announcementEl?.classList.remove('hidden')
    headerEl?.classList.remove('announcement-hidden')
  })
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (!target) return
  const opener = target.closest('[data-cart-trigger]')
  if (opener) {
    event.preventDefault()
    openCart()
    return
  }
  const closer = target.closest('[data-cart-close]')
  if (closer) {
    event.preventDefault()
    closeCart()
    return
  }
  if (target.classList.contains('cart-drawer-backdrop')) {
    closeCart()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeCart()
}

function setupHistoryListener() {
  const dispatch = () => window.dispatchEvent(new Event('locationchange'))
  const push = history.pushState
  history.pushState = function (...args: any[]) {
    // @ts-ignore - preserve default behaviour
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
}

function hydrateDom() {
  refreshDomRefs()
  setupAnimationObservers()
  document.querySelectorAll('.hero-subtitle, .hero-cta, .hero-caption').forEach((el) => {
    (el as HTMLElement).classList.add('animate')
  })
  applyHeaderModeByPage()
  applyNoScrollState()
  syncHeaderVars()
  revealVisibleContainers()
  initJadeTimeline(true)
}

function initJadeTimeline(resetItems = false) {
  const items = document.querySelectorAll<HTMLElement>('.jade-process-item')
  if (!items.length) {
    if (jadeTimelineObserver) {
      jadeTimelineObserver.disconnect()
      jadeTimelineObserver = null
    }
    return
  }
  if (typeof IntersectionObserver === 'undefined') {
    items.forEach((item) => item.classList.add('is-visible'))
    return
  }
  if (!jadeTimelineObserver) {
    jadeTimelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            jadeTimelineObserver?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '-10% 0px -20%' },
    )
  } else {
    jadeTimelineObserver.disconnect()
  }
  items.forEach((item) => {
    if (resetItems) {
      item.classList.remove('is-visible')
    }
    if (!item.classList.contains('is-visible')) {
      jadeTimelineObserver!.observe(item)
    }
  })
}

function computeHeaderBottom(): number {
  if (!headerEl) return 84
  const rect = headerEl.getBoundingClientRect()
  return Math.max(72, Math.round(rect.bottom))
}

function openCart() {
  if (!cartDrawerEl) return
  const top = computeHeaderBottom()
  setRootVar('--cart-panel-top', `${top}px`)
  document.body.classList.add('cart-open')
  cartDrawerEl.setAttribute('aria-hidden', 'false')
  cartDrawerEl.classList.add('is-open')
  if (cartPanelEl) {
    void cartPanelEl.offsetHeight
    cartPanelEl.style.transform = 'translateX(0)'
  }
  renderCart()
}

function closeCart() {
  if (!cartDrawerEl) return
  cartDrawerEl.setAttribute('aria-hidden', 'true')
  cartDrawerEl.classList.remove('is-open')
  if (cartPanelEl) cartPanelEl.style.transform = ''
  document.body.classList.remove('cart-open')
}

async function fetchCart() {
  try {
    const res = await fetch('/api/cart', { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

function setCheckoutUrl(url?: string) {
  const cta = cartFooterEl?.querySelector('.cart-cta') as HTMLAnchorElement | null
  if (!cta) return
  if (url) {
    cta.href = '/api/cart/checkout'
    cta.dataset.checkoutUrl = url
    cta.removeAttribute('aria-disabled')
  } else {
    delete cta.dataset.checkoutUrl
    cta.href = '#'
    cta.setAttribute('aria-disabled', 'true')
  }
}

function attachCartRetryHandlers() {
  if (!cartBodyEl) return
  cartBodyEl.querySelectorAll('[data-cart-refresh]').forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        ;(btn as HTMLButtonElement).setAttribute('disabled', 'true')
        renderCart()
      },
      { once: true },
    )
  })
}

async function renderCart(options?: RenderCartOptions) {
  if (!cartBodyEl) return
  const notices: CartNotice[] = [...(options?.notices ?? [])]
  const freshCart = await fetchCart()
  let cart = freshCart
  let servedFromCache = false

  if (!cart) {
    const cached = readCartSnapshot()
    if (cached) {
      cart = cached
      servedFromCache = true
      notices.unshift({
        tone: 'warning',
        message: "We couldn't refresh your bag. Showing the last saved items - refresh to continue.",
      })
    }
  }

  if (!cart) {
    cartBodyEl.innerHTML = `
      <div class="cart-status cart-status--error">
        <p>We can't load your bag right now. Check your connection and try again.</p>
        <button type="button" class="cart-refresh" data-cart-refresh>Retry</button>
      </div>
    `
    const summaryValue = cartFooterEl?.querySelector('.cart-summary span:last-child') as HTMLElement | null
    if (summaryValue) summaryValue.textContent = '$0.00'
    setCheckoutUrl(undefined)
    attachCartRetryHandlers()
    return
  }

  const hasLines = cart?.lines?.edges?.length > 0
  if (!hasLines) {
    cartBodyEl.innerHTML = '<p class="cart-empty">Your bag is empty.</p>'
    const summaryValue = cartFooterEl?.querySelector('.cart-summary span:last-child') as HTMLElement | null
    if (summaryValue) summaryValue.textContent = '$0.00'
    if (!servedFromCache) persistCartSnapshot(null)
    setCheckoutUrl(undefined)
    attachCartRetryHandlers()
    return
  }

  if (!servedFromCache) persistCartSnapshot(cart)

  const itemsHtml = cart.lines.edges.map((edge: any) => {
    const n = edge.node
    const p = n.merchandise?.product
    const img = p?.images?.edges?.[0]?.node
    const price = n.cost?.subtotalAmount
    return `
      <div class="cart-item" data-line-id="${n.id}">
        <a class="cart-item-link" href="/shop/${p?.handle || ''}" aria-label="View ${p?.title || 'product'}">
          <div class="cart-item-media">${img?.url ? `<img src="${img.url}" alt="${img?.altText || ''}" />` : ''}</div>
          <div class="cart-item-info">
            <div class="cart-item-title">${p?.title || ''}</div>
            <div class="cart-item-sub">Qty ${n.quantity}</div>
          </div>
        </a>
        <div class="cart-item-price">${price ? formatMoney(parseFloat(price.amount), price.currencyCode) : ''}</div>
        <button class="cart-item-remove" aria-label="Remove item" data-remove-line="${n.id}" title="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    `
  }).join('')

  const noticeHtml = cartNoticesHtml(notices)
  cartBodyEl.innerHTML = `${noticeHtml}${itemsHtml}`
  const sub = cart.cost?.subtotalAmount
  const summaryValue = cartFooterEl?.querySelector('.cart-summary span:last-child') as HTMLElement | null
  if (summaryValue) summaryValue.textContent = sub ? formatMoney(parseFloat(sub.amount), sub.currencyCode) : '$0.00'
  setCheckoutUrl(servedFromCache ? undefined : cart.checkoutUrl)
  attachCartRetryHandlers()

  cartBodyEl.querySelectorAll('[data-remove-line]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const lineId = (e.currentTarget as HTMLElement).getAttribute('data-remove-line')
      if (!lineId) return
      const itemEl = (e.currentTarget as HTMLElement).closest('.cart-item')
      if (itemEl) itemEl.classList.add('is-removing')
      ;(e.currentTarget as HTMLButtonElement).setAttribute('disabled', 'true')
      try {
        const res = await fetch('/api/cart/lines', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineIds: [lineId] }),
        })
        if (res.ok) {
          await renderCart()
        } else {
          await renderCart({
            notices: [{ tone: 'error', message: "We couldn't update your bag. Please try again." }],
          })
        }
      } catch {
        await renderCart({
          notices: [{ tone: 'error', message: 'Something went wrong removing that item. Please retry.' }],
        })
      }
    })
  })
}

export function initClientBehaviors() {
  hydrateDom()
  if (_initialized) return
  _initialized = true

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  window.addEventListener('load', () => hydrateDom())
  window.addEventListener('locationchange', handleRouteChange)
  setupHistoryListener()
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('tomi:cart:open', () => openCart())
}
