import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface QAItem { q: string; a: string }

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

function parseFAQMarkdown(md: string): QAItem[] {
  const lines = md.split(/\r?\n/)
  const items: QAItem[] = []
  let q = ''
  let a: string[] = []
  for (const line of lines) {
    if (line.startsWith('Q:')) {
      if (q) items.push({ q, a: a.join(' ').trim() })
      q = line.replace(/^Q:\s*/, '').trim()
      a = []
    } else if (line.trim()) {
      a.push(line.trim())
    }
  }
  if (q) items.push({ q, a: a.join(' ').trim() })
  return items
}

export async function GET() {
  try {
    const faqPath = path.join(process.cwd(), 'src', 'app', 'FAQ.md')
    const md = await fs.readFile(faqPath, 'utf8')
    const items = parseFAQMarkdown(md)
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}
