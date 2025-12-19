'use client'

import React, { useMemo, useState } from 'react'

type Intent = 'appointment' | 'repairs' | 'returns' | 'general'

type Props = {
  initialIntent?: Intent
  source?: string
  utm?: Partial<Record<'utmSource' | 'utmMedium' | 'utmCampaign' | 'utmTerm' | 'utmContent', string>>
}

function normalizeIntent(value: unknown): Intent {
  if (value === 'appointment' || value === 'repairs' || value === 'returns' || value === 'general') return value
  return 'general'
}

function trimOrEmpty(v: string) {
  return v.trim()
}

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function ContactForm({ initialIntent, source, utm }: Props) {
  const [intent, setIntent] = useState<Intent>(normalizeIntent(initialIntent))

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [message, setMessage] = useState('')

  // Appointment fields
  const [appointmentFor, setAppointmentFor] = useState<'visit' | 'jadeBar' | 'other'>(() => {
    if (source === 'jadeBar') return 'jadeBar'
    if (source === 'visit') return 'visit'
    return 'visit'
  })
  const [preferredDate1, setPreferredDate1] = useState('')
  const [preferredTime1, setPreferredTime1] = useState('')
  const [preferredDate2, setPreferredDate2] = useState('')
  const [preferredTime2, setPreferredTime2] = useState('')
  const [inPersonOrVirtual, setInPersonOrVirtual] = useState<'in_person' | 'virtual' | 'either'>('in_person')

  // Repairs fields
  const [itemType, setItemType] = useState('')
  const [issueDescription, setIssueDescription] = useState('')
  const [purchaseOrOrderNumber, setPurchaseOrOrderNumber] = useState('')
  const [desiredOutcome, setDesiredOutcome] = useState('')

  // Returns fields
  const [orderNumber, setOrderNumber] = useState('')
  const [returnOrExchange, setReturnOrExchange] = useState<'return' | 'exchange' | ''>('')
  const [returnReason, setReturnReason] = useState('')
  const [items, setItems] = useState('')

  // General contact fields
  const [contactReason, setContactReason] = useState<'general' | 'shipping' | 'order' | 'other'>('general')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const canSubmit = useMemo(() => {
    const emailOk = looksLikeEmail(trimOrEmpty(email))
    if (!emailOk) return false
    if (intent === 'repairs') return Boolean(trimOrEmpty(issueDescription) || trimOrEmpty(message))
    if (intent === 'returns') return Boolean(trimOrEmpty(orderNumber) || trimOrEmpty(message))
    if (intent === 'appointment') return Boolean(trimOrEmpty(preferredDate1) || trimOrEmpty(message))
    return Boolean(trimOrEmpty(message))
  }, [email, intent, issueDescription, message, orderNumber, preferredDate1])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSuccess(false)

    const emailTrimmed = trimOrEmpty(email)
    if (!looksLikeEmail(emailTrimmed)) {
      setError('Please enter a valid email.')
      return
    }

    setSubmitting(true)
    try {
      const sourceFlow = source ? `${source}->contact` : 'contact'
      const base = {
        sourcePath: '/contact',
        sourceFlow,
        utmSource: utm?.utmSource || '',
        utmMedium: utm?.utmMedium || '',
        utmCampaign: utm?.utmCampaign || '',
        utmTerm: utm?.utmTerm || '',
        utmContent: utm?.utmContent || '',
        fullName: trimOrEmpty(fullName),
        email: emailTrimmed,
        phone: trimOrEmpty(phone),
        notesOrMessage: trimOrEmpty(message),
        intent,
        source: source || '',
      }

      const payload =
        intent === 'appointment'
          ? {
              ...base,
              formType: 'appointments',
              appointmentFor,
              preferredDate1: trimOrEmpty(preferredDate1),
              preferredTime1: trimOrEmpty(preferredTime1),
              preferredDate2: trimOrEmpty(preferredDate2),
              preferredTime2: trimOrEmpty(preferredTime2),
              inPersonOrVirtual,
            }
          : intent === 'repairs'
            ? {
                ...base,
                formType: 'repairs',
                itemType: trimOrEmpty(itemType),
                issueDescription: trimOrEmpty(issueDescription),
                purchaseOrOrderNumber: trimOrEmpty(purchaseOrOrderNumber),
                desiredOutcome: trimOrEmpty(desiredOutcome),
              }
            : intent === 'returns'
              ? {
                  ...base,
                  formType: 'returns',
                  orderNumber: trimOrEmpty(orderNumber),
                  returnOrExchange,
                  reason: trimOrEmpty(returnReason),
                  items: trimOrEmpty(items),
                }
              : {
                  ...base,
                  formType: 'contact_us',
                  contactReason,
                  orderNumber: trimOrEmpty(orderNumber),
                }

      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const out = await res.json().catch(() => ({}))
        throw new Error(out?.error || 'Failed to send message')
      }
      setSuccess(true)
      setMessage('')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="space-y-2">
        <label htmlFor="intent" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">
          What can we help with?
        </label>
        <select
          id="intent"
          value={intent}
          onChange={(e) => setIntent(normalizeIntent(e.target.value))}
          className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
        >
          <option value="general">General question</option>
          <option value="appointment">Book an appointment</option>
          <option value="repairs">Repairs</option>
          <option value="returns">Returns & exchanges</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
            placeholder="Your email"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">
          Phone (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
          placeholder="Your phone number"
        />
      </div>

      {intent === 'appointment' && (
        <div className="space-y-6 pt-4 border-t border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Appointment for</label>
              <select
                value={appointmentFor}
                onChange={(e) => setAppointmentFor(e.target.value as any)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              >
                <option value="visit">Showroom visit</option>
                <option value="jadeBar">Jade Bar</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">In-person or virtual</label>
              <select
                value={inPersonOrVirtual}
                onChange={(e) => setInPersonOrVirtual(e.target.value as any)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              >
                <option value="in_person">In-person</option>
                <option value="virtual">Virtual</option>
                <option value="either">Either</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Preferred date</label>
              <input
                type="date"
                value={preferredDate1}
                onChange={(e) => setPreferredDate1(e.target.value)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Preferred time</label>
              <input
                type="time"
                value={preferredTime1}
                onChange={(e) => setPreferredTime1(e.target.value)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Backup date</label>
              <input
                type="date"
                value={preferredDate2}
                onChange={(e) => setPreferredDate2(e.target.value)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Backup time</label>
              <input
                type="time"
                value={preferredTime2}
                onChange={(e) => setPreferredTime2(e.target.value)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {intent === 'repairs' && (
        <div className="space-y-6 pt-4 border-t border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Item type</label>
              <input
                type="text"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
                placeholder="Ring, necklace, bracelet..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Order # (optional)</label>
              <input
                type="text"
                value={purchaseOrOrderNumber}
                onChange={(e) => setPurchaseOrOrderNumber(e.target.value)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
                placeholder="Order number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">What needs repair?</label>
            <textarea
              rows={4}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full bg-[#F9F8F6] border border-transparent p-4 text-stone-900 focus:outline-none focus:bg-white focus:border-stone-300 transition-all text-sm resize-none"
              placeholder="Describe the issue (stone loose, clasp broken, resizing...)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Desired outcome (optional)</label>
            <input
              type="text"
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              placeholder="Resize, replace clasp, restore finish..."
            />
          </div>
        </div>
      )}

      {intent === 'returns' && (
        <div className="space-y-6 pt-4 border-t border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Order number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
                placeholder="Order #"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Return or exchange</label>
              <select
                value={returnOrExchange}
                onChange={(e) => setReturnOrExchange(e.target.value as any)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              >
                <option value="">Select</option>
                <option value="return">Return</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Reason (optional)</label>
            <input
              type="text"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              placeholder="Sizing, gift, issue..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Items (optional)</label>
            <input
              type="text"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              placeholder="What are you returning/exchanging?"
            />
          </div>
        </div>
      )}

      {intent === 'general' && (
        <div className="space-y-6 pt-4 border-t border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Topic</label>
              <select
                value={contactReason}
                onChange={(e) => setContactReason(e.target.value as any)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
              >
                <option value="general">General</option>
                <option value="order">Order</option>
                <option value="shipping">Shipping</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Order # (optional)</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
                placeholder="Order number"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#F9F8F6] border border-transparent p-4 text-stone-900 focus:outline-none focus:bg-white focus:border-stone-300 transition-all text-sm resize-none"
          placeholder="How can we help?"
        />
      </div>

      {error && <div className="text-sm text-red-700">{error}</div>}
      {success && <div className="text-sm text-green-700">Thanks — we received your message.</div>}

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className={[
          'w-full text-white text-xs font-bold uppercase tracking-[0.2em] py-5 transition-colors',
          !canSubmit || submitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-700',
        ].join(' ')}
      >
        {submitting ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}


