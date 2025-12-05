import { NextResponse } from 'next/server'

const SHEET_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTLxVqOIbxu7rPJamZUUELT1QNT6S0PcQAgVDF7g5-Xf9wFkFBs5GkWgrzjSJHp895QDbHIPmLj--n/pub?output=csv'

// Simple CSV splitter that respects commas inside double quotes
const splitCsvRow = (row: string) => {
  const parts: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < row.length; i++) {
    const char = row[i]
    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (char === ',' && !inQuotes) {
      parts.push(current)
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current)
  return parts.map((p) => p.trim())
}

const driveDirectUrl = (url: string) => {
  // If already a direct uc link, keep as-is but normalize to export=download for raw binary
  if (url.includes('drive.google.com/uc?')) {
    if (url.includes('export=download')) return url
    const idInUrl = url.match(/[?&]id=([^&]+)/)?.[1]
    if (idInUrl) return `https://drive.google.com/uc?export=download&id=${idInUrl}`
    return url
  }
  const idMatch = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/)
  if (!idMatch) return url
  // Use export=download to avoid HTML wrapper and deliver the binary
  return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`
}

export async function GET() {
  try {
    const res = await fetch(SHEET_CSV, { cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json({ slides: [] }, { status: 200 })
    }
    const text = await res.text()
    const rows = text.trim().split(/\r?\n/).filter(Boolean)
    if (!rows.length) return NextResponse.json({ slides: [] }, { status: 200 })

    const headers = splitCsvRow(rows[0]).map((h) => h.trim().toLowerCase())
    const imageUrlIdx = headers.findIndex((h) => h === 'imageurl' || h === 'image url' || h === 'url' || h === 'image')
    const linkIdx = headers.findIndex((h) => h === 'link' || h === 'href')
    const altIdx = headers.findIndex((h) => h === 'alt' || h === 'caption' || h === 'description')
    const srcIdx = imageUrlIdx
    if (srcIdx === -1) return NextResponse.json({ slides: [] }, { status: 200 })

    const slides = rows.slice(1).map((row, i) => {
      const cols = splitCsvRow(row)
      const rawSrc = cols[srcIdx]?.trim() || ''
      const rawHref = linkIdx !== -1 ? cols[linkIdx]?.trim() || '' : ''
      const alt = altIdx !== -1 ? cols[altIdx]?.trim() || 'Social highlight' : 'Social highlight'
      return {
        id: `social-remote-${i + 1}`,
        src: driveDirectUrl(rawSrc),
        alt,
        href: rawHref || undefined,
      }
    }).filter((s) => s.src)

    return NextResponse.json({ slides }, { status: 200 })
  } catch (error) {
    console.error('Social API fetch failed', error)
    return NextResponse.json({ slides: [] }, { status: 200 })
  }
}

