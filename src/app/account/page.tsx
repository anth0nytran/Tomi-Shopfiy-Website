import Link from 'next/link'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { env } from '@/lib/env'
import { fetchCustomerOverview } from '@/lib/customer-account'
import { getCustomerAccessToken } from '@/lib/auth/session'
import { formatPrice } from '@/lib/utils'
import { ChevronRight, ChevronDown } from 'lucide-react'

const SIGN_IN_URL = '/api/auth/shopify/login?returnTo=/account'

function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <AnnouncementBar />
      <Header />
      <div className="pt-32 pb-24 flex-1">
        {children}
      </div>
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
      <section className="container mx-auto px-6 max-w-2xl text-center py-20">
        <div className="bg-white p-12 md:p-16 border border-stone-100 shadow-sm rounded-sm">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">
            {eyebrow}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-stone-900 mb-6">
            {title}
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed mb-10 text-balance">
            {copy}
          </p>
          
          {checklist?.length ? (
            <ul className="text-left max-w-md mx-auto space-y-4 mb-10 border-t border-stone-100 pt-8">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600 font-light">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#efdada]" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-col gap-4 items-center">
            {cta ? (
              <a 
                href={cta.href}
                className="inline-flex items-center justify-center px-10 py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors min-w-[200px]"
              >
                {cta.label}
              </a>
            ) : null}
            
            {secondaryCta ? (
              <Link 
                href={secondaryCta.href}
                className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-primary border-b border-transparent hover:border-primary pb-0.5 transition-all"
              >
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
      secondaryCta: { label: 'Need help? Contact us', href: '/contact' },
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
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-10 mb-12 gap-6">
          <div>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
              Account
            </span>
            <h1 className="font-heading text-4xl md:text-5xl text-stone-900 mb-2">
              {displayName}
            </h1>
            <p className="text-stone-500 font-light">
              Manage your profile and order history.
            </p>
          </div>
          <form method="POST" action="/api/auth/shopify/logout">
            <button 
              type="submit" 
              className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 border border-stone-200 px-6 py-3 hover:border-stone-900 transition-colors"
            >
              Sign out
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Profile & Support */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Contact Card */}
            <div className="bg-white p-8 border border-stone-100 rounded-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 mb-6 border-b border-stone-100 pb-4">
                Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Email</span>
                  <span className="text-stone-900 font-medium">{overview.email || '—'}</span>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white p-8 border border-stone-100 rounded-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 mb-6 border-b border-stone-100 pb-4">
                Support
              </h3>
              <p className="text-sm text-stone-600 font-light leading-relaxed mb-6">
                Have a question about an order or need to process a return? We're here to help.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-stone-900 transition-colors"
              >
                Contact Us <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

          {/* Right Column: Orders */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-10 border border-stone-100 rounded-sm min-h-[400px]">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 mb-8 border-b border-stone-100 pb-4">
                Order History
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-stone-500 font-light mb-6">You haven't placed any orders yet.</p>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#efdada] text-stone-900 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-200 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const date = new Date(order.processedAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                    const orderLabel = `Order #${order.orderNumber || order.id.slice(-4)}`
                    
                    return (
                      <details key={order.id} className="group border border-stone-100 rounded-sm open:border-stone-200 open:shadow-sm transition-all">
                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-stone-50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                            <span className="font-heading text-xl text-stone-900">{orderLabel}</span>
                            <span className="text-xs uppercase tracking-widest text-stone-500">{date}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm ${
                              order.fulfillmentStatus === 'FULFILLED' 
                                ? 'bg-[#dcfce7] text-green-800' 
                                : 'bg-stone-100 text-stone-600'
                            }`}>
                              {order.fulfillmentStatus || 'Processing'}
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-stone-400 transition-transform group-open:rotate-180" />
                        </summary>
                        
                        <div className="p-6 pt-0 border-t border-stone-100 mt-4">
                          <ul className="divide-y divide-stone-100">
                            {order.lineItems.map((item) => (
                              <li key={item.id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  {item.imageUrl && (
                                    <div className="relative w-12 h-12 bg-stone-100 overflow-hidden rounded-sm flex-shrink-0">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-stone-900">{item.name}</p>
                                    <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                {item.totalAmount && item.totalCurrencyCode && (
                                  <span className="text-sm font-light text-stone-900">
                                    {formatPrice(item.totalAmount, item.totalCurrencyCode)}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-6 pt-6 border-t border-stone-100 flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Total</span>
                            <span className="font-heading text-lg text-stone-900">
                              {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                            </span>
                          </div>
                        </div>
                      </details>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </AccountShell>
  )
}
