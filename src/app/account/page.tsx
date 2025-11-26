import Link from 'next/link'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { env } from '@/lib/env'
import { fetchCustomerOverview } from '@/lib/customer-account'
import { getCustomerAccessToken } from '@/lib/auth/session'
import { formatPrice } from '@/lib/utils'
const SIGN_IN_URL = '/api/auth/shopify/login?returnTo=/account'

function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="account-main">
      <AnnouncementBar />
      <Header />
      {children}
      <Footer />
    </main>
  )
}

type NoticeContent = {
  eyebrow?: string
  title: string
  copy: string
  cta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  checklist?: string[]
}

function AccountNotice({ eyebrow = 'Notice', title, copy, cta, secondaryCta, checklist }: NoticeContent) {
  return (
    <AccountShell>
      <section className="account-notice" aria-label="Account status">
        <div className="account-notice-card">
          <div className="account-notice-head">
            <p className="account-eyebrow account-eyebrow--underlined">{eyebrow}</p>
            <h1 className="account-notice-title">{title}</h1>
            <p className="account-notice-copy">{copy}</p>
          </div>
          {checklist?.length ? (
            <ul className="account-notice-list">
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <div className="account-notice-actions">
            {cta ? (
              <a className="account-btn" href={cta.href}>
                {cta.label}
              </a>
            ) : null}
            {secondaryCta ? (
              <Link className="account-link" href={secondaryCta.href}>
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </AccountShell>
  )
}

export default async function AccountPage() {
  if (!env.customerAccountsEnabled) {
    return AccountNotice({
      title: 'Customer accounts are disabled',
      copy: 'Enable CUSTOMER_ACCOUNTS_ENABLED in your environment to view this page.',
    })
  }

  const token = await getCustomerAccessToken()
  if (!token) {
    return AccountNotice({
      eyebrow: 'Account',
      title: 'Welcome back',
      copy: 'Sign in to view your orders and manage your account.',
      checklist: ['Track orders at a glance', 'Keep shipping details ready', 'Request service or care updates'],
      cta: { label: 'Sign in', href: SIGN_IN_URL },
      secondaryCta: { label: 'Need help? Contact us!', href: '/contact' },
    })
  }

  const overview = await fetchCustomerOverview(token)
  if (!overview) {
    return AccountNotice({
      title: 'We couldn’t load your account',
      copy: 'Something interrupted the session. Please sign in again to continue.',
      cta: { label: 'Try again', href: SIGN_IN_URL },
    })
  }

  const orders = overview.orders ?? []
  const displayName = [overview.firstName, overview.lastName].filter(Boolean).join(' ').trim() || overview.email || 'Your account'

  return (
    <AccountShell>
      <section className="account-hero" aria-label="Account snapshot">
        <div className="account-hero-card">
          <div className="account-hero-head">
            <div>
              <p className="account-eyebrow">Account</p>
              <h1 className="account-title">{displayName}</h1>
              <p className="account-subtitle">Manage your profile and orders.</p>
            </div>
            <form method="POST" action="/api/auth/shopify/logout" className="account-signout-form">
              <button type="submit" className="account-btn account-btn--ghost">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="account-grid">
        <div className="account-column">
          <div className="account-card">
            <div className="account-card-head">
              <p className="account-eyebrow">Contact</p>
            </div>
            <ul className="account-details">
              <li>
                <span>Email</span>
                <span>{overview.email || '—'}</span>
              </li>
            </ul>
          </div>

          <div className="account-card">
            <div className="account-card-head">
              <p className="account-eyebrow">Gift cards & discounts</p>
            </div>
            <p className="account-copy">
              Have a gift card or discount code? Enter it during checkout on the payment step and Shopify will apply it to your
              order automatically.
            </p>
            <p className="account-copy">
              Need help?{' '}
              <Link className="account-link" href="/contact">
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="account-column">
          <div className="account-card">
            <div className="account-card-head">
              <p className="account-eyebrow">Recent orders</p>
            </div>
            {orders.length === 0 ? (
              <div className="account-empty">
                <p>No orders placed just yet.</p>
                <Link className="account-link" href="/shop">
                  Browse the collection →
                </Link>
              </div>
            ) : (
              <ol className="account-timeline">
                {orders.map((order) => {
                  const date = new Date(order.processedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                  const orderLabel = `Order ${order.name || order.id}`
                  return (
                    <li key={order.id}>
                      <details className="account-order">
                        <summary className="account-order-summary">
                          <div>
                            <p className="account-timeline-title">{orderLabel}</p>
                            <p className="account-timeline-meta">{date}</p>
                          </div>
                          <span aria-hidden="true">▾</span>
                        </summary>
                        <ul className="account-order-items">
                          {order.lineItems.map((item) => {
                            const total =
                              item.totalAmount && item.totalCurrencyCode
                                ? formatPrice(item.totalAmount, item.totalCurrencyCode)
                                : null
                            return (
                              <li key={item.id}>
                                <div className="account-order-item">
                                  <div className="account-order-item-info">
                                    {item.imageUrl ? (
                                      <div className="account-order-item-thumb">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.imageUrl} alt={item.name} />
                                      </div>
                                    ) : null}
                                    <p className="account-order-item-name">{item.name}</p>
                                    <p className="account-order-item-meta">Qty {item.quantity}</p>
                                  </div>
                                  {total ? <p className="account-order-item-total">{total}</p> : null}
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </details>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>
        </div>
      </section>
    </AccountShell>
  )
}
