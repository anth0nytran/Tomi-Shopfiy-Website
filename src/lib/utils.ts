// Utility functions for the Tomi Jewelry website

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

function extractFirstNumber(value: string): number | null {
  // Supports "6", "6.5", "Size 6", "US 6.5", etc.
  const match = value.match(/-?\d+(?:\.\d+)?/)
  if (!match) return null
  const n = Number.parseFloat(match[0])
  return Number.isFinite(n) ? n : null
}

/**
 * Sort size-like strings by their first numeric value (ascending).
 * - Numeric values come first (e.g., 5, 5.5, 6)
 * - Non-numeric/unparseable values are pushed to the end
 * - Stable for ties
 */
export function sortNumericSizes(values: string[]): string[] {
  const items = values.map((raw, idx) => {
    const value = `${raw}`.trim()
    return { value, idx, num: extractFirstNumber(value) }
  })

  items.sort((a, b) => {
    const aHas = a.num !== null
    const bHas = b.num !== null
    if (aHas !== bHas) return aHas ? -1 : 1
    if (aHas && bHas && a.num !== b.num) return (a.num as number) - (b.num as number)
    // Prefer consistent ordering among non-numeric values, but keep stable for exact ties.
    const byText = a.value.localeCompare(b.value)
    if (byText !== 0) return byText
    return a.idx - b.idx
  })

  return items.map((i) => i.value).filter(Boolean)
}