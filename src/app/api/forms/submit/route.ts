import { NextRequest } from 'next/server'
import { appendFormRow, FormType } from '@/lib/sheets'

function isFormType(value: unknown): value is FormType {
  return (
    value === 'contact_us' ||
    value === 'appointments' ||
    value === 'repairs' ||
    value === 'returns' ||
    value === 'jade_consultation' ||
    value === 'mailing_list'
  )
}

function asTrimmedString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function asOptionalTrimmedString(value: unknown): string | undefined {
  const out = asTrimmedString(value)
  return out ? out : undefined
}

function looksLikeEmail(value: string) {
  // intentionally simple (avoid rejecting valid but uncommon emails)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const cleaned = fullName.trim().replace(/\s+/g, ' ')
  if (!cleaned) return { firstName: '', lastName: '' }
  const parts = cleaned.split(' ')
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function formatSubmittedAtCst(date: Date) {
  // America/Chicago (CST/CDT). We label it "CT" to avoid DST ambiguity.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type: string) => parts.find((p) => p.type === type)?.value || ''
  // en-CA yields yyyy-mm-dd ordering.
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')} CT`
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const formTypeRaw = (body as any).formType
  if (!isFormType(formTypeRaw)) {
    return new Response(JSON.stringify({ error: 'Invalid formType' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const formType = formTypeRaw

  const email = asTrimmedString((body as any).email)
  if (!email || !looksLikeEmail(email)) {
    return new Response(JSON.stringify({ error: 'A valid email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Human-friendly + sortable, stored in Central Time.
  // Example: "2025-12-19 11:03:21 CT"
  const submittedAt = formatSubmittedAtCst(new Date())

  // Normalize common fields (keep extra fields in rawPayloadJson)
  const fullName = asOptionalTrimmedString((body as any).fullName) || ''
  const firstNameRaw = asOptionalTrimmedString((body as any).firstName) || ''
  const lastNameRaw = asOptionalTrimmedString((body as any).lastName) || ''

  const derivedFromFull = fullName && (!firstNameRaw || !lastNameRaw) ? splitName(fullName) : { firstName: '', lastName: '' }
  const firstName = firstNameRaw || derivedFromFull.firstName
  const lastName = lastNameRaw || derivedFromFull.lastName
  const normalizedFullName = fullName || [firstName, lastName].filter(Boolean).join(' ')

  const row: Record<string, unknown> = {
    submittedAt,
    formType,
    sourcePath: asOptionalTrimmedString((body as any).sourcePath) || '',
    sourceFlow: asOptionalTrimmedString((body as any).sourceFlow) || '',
    utmSource: asOptionalTrimmedString((body as any).utmSource) || '',
    utmMedium: asOptionalTrimmedString((body as any).utmMedium) || '',
    utmCampaign: asOptionalTrimmedString((body as any).utmCampaign) || '',
    utmTerm: asOptionalTrimmedString((body as any).utmTerm) || '',
    utmContent: asOptionalTrimmedString((body as any).utmContent) || '',

    fullName: normalizedFullName,
    firstName,
    lastName,
    email,
    phone: asOptionalTrimmedString((body as any).phone) || '',

    // Common “message” bucket
    notesOrMessage: asOptionalTrimmedString((body as any).notesOrMessage) || asOptionalTrimmedString((body as any).message) || '',
  }

  // Pass through known per-form fields (we only add if present; sheet mapping will place blanks)
  const passthroughKeys: string[] = [
    // ContactUs
    'contactReason',
    'orderNumber',

    // Appointments
    'appointmentFor',
    'preferredDate1',
    'preferredTime1',
    'preferredDate2',
    'preferredTime2',
    'inPersonOrVirtual',

    // Repairs
    'itemType',
    'issueDescription',
    'purchaseOrOrderNumber',
    'desiredOutcome',

    // Returns
    'returnOrExchange',
    'reason',
    'items',

    // JadeConsultation
    'consultationProfile',
    'desiredDate',
    'jewelryType',
    'chainStyle',
    'chainColor',
    'bailShape',
    'bailColor',
    'byoChain',

    // MailingList
    'optIn',
    'sourcePlacement',
  ]

  for (const key of passthroughKeys) {
    const v = (body as any)[key]
    if (v === undefined || v === null) continue
    row[key] = typeof v === 'string' ? v.trim() : v
  }

  row.rawPayloadJson = JSON.stringify(body)

  try {
    await appendFormRow(formType, row)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Forms submit failed', error)
    return new Response(JSON.stringify({ error: error?.message || 'Failed to submit form' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}


