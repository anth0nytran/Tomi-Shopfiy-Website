import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AccountLink } from './AccountLink'
import { MobileNav } from './MobileNav'
import { CATALOG_ENTRIES, CatalogEntry } from '@/app/shop/catalog'
import { env } from '@/lib/env'
import { getCustomerAccessToken } from '@/lib/auth/session'
import dynamic from 'next/dynamic'
const SearchLauncher = dynamic(() => import('@/components/search/SearchLauncher'), {
  ssr: false,
  loading: () => null,
})

type NavGroupKey = 'featured' | 'categories' | 'collections' | 'custom'

type NavGroup = {
  key: NavGroupKey
  title: string
  entries: CatalogEntry[]
}

const navGroups: NavGroup[] = [
  {
    key: 'featured',
    title: 'Featured',
    entries: CATALOG_ENTRIES.filter((entry) => entry.navGroup === 'featured'),
  },
  {
    key: 'categories',
    title: 'Categories',
    entries: CATALOG_ENTRIES.filter(
      (entry) => entry.navGroup === 'categories' && ['all', 'necklaces', 'bracelets', 'rings', 'earrings'].includes(entry.slug),
    ),
  },
  {
    key: 'collections',
    title: 'Collections',
    entries: CATALOG_ENTRIES.filter((entry) => entry.navGroup === 'collections'),
  },
  {
    key: 'custom',
    title: 'Designed by you',
    entries: CATALOG_ENTRIES.filter((entry) => entry.navGroup === 'custom'),
  },
]

const mobileShopSections = navGroups.map((group) => ({
  title: group.title,
  links: group.entries.map((entry) => ({
    href: toHref(entry),
    label: entry.navLabel || entry.title,
  })),
}))

const mobileNavLinks = [
  {
    href: '/shop',
    label: 'Shop',
    sections: mobileShopSections,
  },
  { href: '/about', label: 'About Us' },
  { href: '/visit', label: 'Visit Us' },
  { href: '/jade-bar', label: 'Jade Bar' },
]

function toHref(entry: CatalogEntry) {
  return entry.slug === 'all' ? '/shop' : `/shop/category/${entry.slug}`
}

export async function Header() {
  const token = env.customerAccountsEnabled ? await getCustomerAccessToken() : null
  return (
    <>
      <header className="header" data-section-type="header">
        <nav className="nav">
          <div className="nav-left">
            <MobileNav links={mobileNavLinks} />
            <div className="nav-left-desktop">
            <div className="nav-item nav-item--dropdown">
              <Link href="/shop" className="nav-link nav-link--dropdown" aria-haspopup="true" aria-expanded="false">SHOP</Link>
              <div className="nav-dropdown" role="menu" aria-label="Shop menu">
                <div className="nav-dropdown-inner">
                  {navGroups.map((group) => (
                    <div className="nav-dd-group" key={group.key}>
                      <h4 className="nav-dd-title">{group.title}</h4>
                      {group.entries.map((entry) => (
                        <Link
                          key={entry.slug}
                          href={toHref(entry)}
                          className="nav-dd-link"
                          role="menuitem"
                        >
                          {entry.navLabel || entry.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/about" className="nav-link">ABOUT US</Link>
            <Link href="/visit" className="nav-link">VISIT US</Link>
            <Link href="/jade-bar" className="nav-link">JADE BAR</Link>
            </div>
          </div>

          <div className="nav-center">
            <Link href="/" className="logo-link" aria-label="Tomi home">
              <Image
                src="/assets/large%20tomi%20logo.png"
                alt="Tomi logo"
                width={200}
                height={250}
                sizes="(max-width: 768px) 120px, 180px"
                className="logo-text logo-text--dark"
                priority
              />
              <Image
                src="/assets/white_tomi_logo.png"
                alt=""
                aria-hidden="true"
                width={200}
                height={250}
                sizes="(max-width: 768px) 120px, 180px"
                className="logo-text logo-text--light"
                priority
              />
            </Link>
          </div>

          <div className="nav-right">
            <AccountLink enabled={env.customerAccountsEnabled} isLoggedIn={Boolean(token)} />
            <SearchLauncher />
            <button className="nav-icon js-cart-open" aria-label="Shopping Bag" data-cart-trigger type="button" title="Open cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </nav>
      </header>
      <aside className="cart-drawer" aria-hidden="true" role="dialog" aria-label="Shopping cart">
        <div className="cart-drawer-backdrop" data-cart-close></div>
        <div className="cart-drawer-panel" data-cart-panel>
          <header className="cart-drawer-header">
            <h3 className="cart-title">Your bag</h3>
            <button className="cart-close" aria-label="Close cart" data-cart-close>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </header>
          <div className="cart-body" id="cart-body">
            <p className="cart-empty">Your bag is empty.</p>
          </div>
          <footer className="cart-footer" id="cart-footer">
            <div className="cart-summary"><span>Subtotal</span><span>$0.00</span></div>
            <a className="cart-cta" href="#" aria-disabled="true">Checkout</a>
          </footer>
        </div>
      </aside>
    </>
  )
}
