type RawEventRow = Record<string, string>

export type EventEntry = {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  link?: string
  image?: string
  isFeatured: boolean
  weekdayLabel: string
  dateLabel: string
  startTimestamp: number
}

const SHEET_ID = '1oo4-nYA5SboG1JZ88bD4Kwxn6BH8FGtN3I0dqUxOkWU'
const DEFAULT_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
const MAX_FALLBACK_TIMESTAMP = 8640000000000000 // Largest valid JS timestamp
const MAX_TEXT_LENGTH = 600
const MAX_TITLE_LENGTH = 120
const MAX_LOCATION_LENGTH = 160
const URL_MAX_LENGTH = 400
const TRUE_VALUES = new Set(['true', '1', 'yes', 'y', 'featured'])
const PAST_EVENT_GRACE_MS = 60 * 60 * 1000 // 1 hour

const SANITIZE_REGEX = /[\u0000-\u001F\u007F]/g
const TAG_REGEX = /<[^>]+>/g
const SPACE_REGEX = /\s+/g

function sanitizeText(value?: string | null, maxLength = MAX_TEXT_LENGTH): string {
  if (!value) return ''
  let cleaned = value.replace(TAG_REGEX, '')
  cleaned = cleaned.replace(SANITIZE_REGEX, ' ')
  cleaned = cleaned.replace(SPACE_REGEX, ' ').trim()
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength).trim()
  }
  return cleaned
}

function sanitizeUrl(candidate?: string | null, maxLength = URL_MAX_LENGTH): string | undefined {
  const trimmed = sanitizeText(candidate, maxLength)
  if (!trimmed) return undefined
  if (!/^https?:\/\//i.test(trimmed)) return undefined
  try {
    const url = new URL(trimmed)
    return url.toString()
  } catch {
    return undefined
  }
}

function parseBoolean(value?: string): boolean {
  if (!value) return false
  return TRUE_VALUES.has(value.trim().toLowerCase())
}

function extractStartTime(value: string): string {
  const [firstSegment] = value.split('-')
  return firstSegment?.trim() ?? value
}

function parseTimeSegment(segment: string): { hours: number; minutes: number } | null {
  if (!segment) return null
  const normalized = segment.toLowerCase()
  const match12 = normalized.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/)
  if (match12) {
    let hours = parseInt(match12[1], 10)
    const minutes = parseInt(match12[2] ?? '0', 10)
    if (match12[3] === 'pm' && hours !== 12) hours += 12
    if (match12[3] === 'am' && hours === 12) hours = 0
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return { hours, minutes }
    }
  }
  const match24 = normalized.match(/^(\d{1,2})(?::(\d{2}))?$/)
  if (match24) {
    const hours = parseInt(match24[1], 10)
    const minutes = parseInt(match24[2] ?? '0', 10)
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return { hours, minutes }
    }
  }
  return null
}

function getStartTimestamp(date: string, time: string): number {
  const baseDate = new Date(date)
  if (Number.isNaN(baseDate.getTime())) return Number.NaN
  const startSegment = extractStartTime(time)
  const parsedTime = parseTimeSegment(startSegment)
  if (parsedTime) {
    baseDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0)
  }
  return baseDate.getTime()
}

function parseCsv(input: string): RawEventRow[] {
  const normalizedInput = input.replace(/^\uFEFF/, '')
  const rows: RawEventRow[] = []
  const headers: string[] = []
  let current = ''
  let cellValues: string[] = []
  let inQuotes = false

  const pushCell = () => {
    cellValues.push(current.trim())
    current = ''
  }

  const pushRow = () => {
    if (cellValues.length === 0) return
    if (headers.length === 0) {
      headers.push(...cellValues.map((header) => header.toLowerCase()))
    } else {
      const row: RawEventRow = {}
      cellValues.forEach((value, index) => {
        const key = headers[index] ?? `col_${index}`
        row[key] = value
      })
      rows.push(row)
    }
    cellValues = []
  }

  for (let i = 0; i < normalizedInput.length; i += 1) {
    const char = normalizedInput[i]
    const next = normalizedInput[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      pushCell()
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1
      }
      pushCell()
      pushRow()
      continue
    }

    current += char
  }

  // Push any remaining data
  if (current.length || inQuotes || cellValues.length) {
    pushCell()
    pushRow()
  }

  return rows
}

function normalizeRow(row: RawEventRow): EventEntry | null {
  const title = sanitizeText(row.title, MAX_TITLE_LENGTH)
  const date = sanitizeText(row.date, 40)
  const time = sanitizeText(row.time, 80)
  const location = sanitizeText(row.location, MAX_LOCATION_LENGTH)
  const description = sanitizeText(row.description)
  const link = sanitizeUrl(row.link, URL_MAX_LENGTH)
  const image = sanitizeUrl(row.picture, URL_MAX_LENGTH)
  const isFeatured = parseBoolean(row.featured)

  if (!title || !date || !time || !location || !description) {
    return null
  }

  const startTimestamp = getStartTimestamp(date, time)
  if (Number.isNaN(startTimestamp)) {
    return null
  }

  const parsedDate = new Date(startTimestamp)
  const weekdayLabel = weekdayFormatter.format(parsedDate).toUpperCase()
  const dateLabel = dateFormatter.format(parsedDate)

  return {
    id: `${title}-${date}-${time}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    date,
    time,
    location,
    description,
    link,
    image,
    isFeatured,
    weekdayLabel,
    dateLabel,
    startTimestamp,
  }
}

export async function fetchEvents(): Promise<EventEntry[]> {
  const sheetUrl = process.env.TOMI_EVENTS_SHEET_URL || DEFAULT_SHEET_URL

  let csvText = ''
  try {
    const response = await fetch(sheetUrl, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-store' },
    })

    if (!response.ok) {
      console.error('Failed to download events CSV', response.statusText)
      return []
    }

    csvText = await response.text()
  } catch (error) {
    console.error('Error fetching events CSV', error)
    return []
  }

  const parsedRows = parseCsv(csvText)
  const normalized = parsedRows
    .map(normalizeRow)
    .filter((row): row is EventEntry => Boolean(row))

  const deduped: EventEntry[] = []
  const seen = new Set<string>()

  normalized.forEach((event) => {
    let candidateId = event.id || `event-${deduped.length}`
    if (seen.has(candidateId)) {
      let counter = 2
      const base = candidateId
      while (seen.has(`${base}-${counter}`)) counter += 1
      candidateId = `${base}-${counter}`
    }
    seen.add(candidateId)
    deduped.push({ ...event, id: candidateId })
  })

  deduped.sort((a, b) => a.startTimestamp - b.startTimestamp)

  const cutoff = Date.now() - PAST_EVENT_GRACE_MS
  const upcoming = deduped.filter((event) => event.startTimestamp >= cutoff)

  return upcoming.length ? upcoming : deduped
}

