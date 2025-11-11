import Link from 'next/link'
import { env } from '@/lib/env'
import { fetchCustomerOverview } from '@/lib/customer-account'
import { getCustomerAccessToken } from '@/lib/auth/session'
import { formatPrice } from '@/lib/utils'

export default async function AccountPage() {
  if (!env.customerAccountsEnabled) {
    return (
      <main className="service-main">
        <section className="service-hero">
          <div className="service-card">
            <h1>Customer accounts are disabled</h1>
            <p>Enable CUSTOMER_ACCOUNTS_ENABLED in your environment to use this page.</p>
          </div>
        </section>
      </main>
    )
  }

  const token = await getCustomerAccessToken()
  if (!token) {
    return (
      <main className="service-main">
        <section className="service-hero">
          <div className="service-card">
            <h1>Welcome back</h1>
            <p>Sign in to view your orders, saved addresses, and more.</p>
            <Link className="service-link" href="/api/auth/shopify/login?returnTo=/account">Sign in</Link>
          </div>
        </section>
      </main>
    )
  }

  const overview = await fetchCustomerOverview(token)
  if (!overview) {
    return (
      <main className="service-main">
        <section className="service-hero">
          <div className="service-card">
            <h1>We couldn’t load your account</h1>
            <p>Please try signing in again.</p>
            <Link className="service-link" href="/api/auth/shopify/login?returnTo=/account">Sign in</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="service-main">
      <section className="service-hero" aria-label="Account overview">
        <div className="service-card">
          <div className="service-top">
            <div>
              <p className="service-eyebrow">Account</p>
              <h1 className="service-heading">{overview.firstName ? `${overview.firstName} ${overview.lastName ?? ''}`.trim() : overview.email}</h1>
            </div>
            <form method="POST" action="/api/auth/shopify/logout">
              <button type="submit" className="service-link" style={{ border: 0, background: 'transparent' }}>Sign out</button>
            </form>
          </div>

          <div className="service-divider" />

          <section>
            <h2 className="service-eyebrow">Email</h2>
            <p className="service-copy">{overview.email || '—'}</p>
          </section>

          <section>
            <h2 className="service-eyebrow">Addresses</h2>
            {overview.addresses.length === 0 ? (
              <p className="service-copy">No saved addresses yet.</p>
            ) : (
              <ul className="service-points">
                {overview.addresses.map((address: any) => (
                  <li key={address.id}>{address.formatted?.join?.(', ') || address.address1}</li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="service-eyebrow">Recent orders</h2>
            {overview.orders.length === 0 ? (
              <p className="service-copy">No orders just yet.</p>
            ) : (
              <ul className="service-points">
                {overview.orders.map((order: any) => {
                  const price = order.totalPriceSet?.shopMoney
                  return (
                    <li key={order.id}>
                      Order {order.name || order.id} • {new Date(order.processedAt).toLocaleDateString()} • {price ? formatPrice(price.amount, price.currencyCode) : '—'}
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>
      </section>
    </main>
  )
}
