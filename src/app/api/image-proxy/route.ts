import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * Proxy external images (Google Drive, etc.) to avoid CORS/interstitial issues.
 * Usage: /api/image-proxy?url=<encoded_url>
 */
export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get('url')
  if (!urlParam) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  // --- Security: URL validation / SSRF protections ---
  // Keep this endpoint intentionally narrow: it's for image hosting providers only.
  const MAX_URL_LENGTH = 2048
  if (urlParam.length > MAX_URL_LENGTH) {
    return NextResponse.json({ error: 'URL too long' }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(urlParam)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }

  // Only allow https to prevent mixed content + local network fetches over http.
  if (target.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only https URLs are allowed' }, { status: 400 })
  }

  // Block obvious SSRF targets. (Edge runtime has no DNS/IP resolution we can trust here.)
  const hostname = target.hostname.toLowerCase()
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === 'localhost.localdomain' ||
    hostname.endsWith('.localhost')
  const isPrivateIpLiteral =
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
    hostname.startsWith('127.') ||
    hostname === '0.0.0.0' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('169.254.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)

  if (isLocalhost || isPrivateIpLiteral) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  // Allowlist hosts we expect to proxy images from.
  const ALLOWED_HOSTS = new Set([
    'drive.google.com',
    'lh3.googleusercontent.com',
  ])
  const ALLOWED_SUFFIXES = [
    '.googleusercontent.com',
    '.gstatic.com',
  ]

  const hostAllowed =
    ALLOWED_HOSTS.has(hostname) || ALLOWED_SUFFIXES.some((s) => hostname.endsWith(s))

  if (!hostAllowed) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 })
  }

  try {
    // For Google Drive, follow redirects and get the actual image
    const res = await fetch(target.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'follow',
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    // If Google returned HTML (virus scan page), try the confirm bypass
    if (contentType.includes('text/html')) {
      // Extract confirm token from HTML and retry
      const html = new TextDecoder().decode(buffer)
      const confirmMatch = html.match(/confirm=([^&"]+)/)
      if (confirmMatch) {
        // Append confirm token to the original target URL.
        const confirmUrl = new URL(target.toString())
        confirmUrl.searchParams.set('confirm', confirmMatch[1] || '')
        const retryRes = await fetch(confirmUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          redirect: 'follow',
        })
        if (retryRes.ok) {
          const retryContentType = retryRes.headers.get('content-type') || 'image/jpeg'
          const retryBuffer = await retryRes.arrayBuffer()
          return new NextResponse(retryBuffer, {
            headers: {
              'Content-Type': retryContentType,
              // Cache a day; Vercel edge cache uses s-maxage.
              'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            },
          })
        }
      }
      return NextResponse.json({ error: 'Image blocked by virus scan' }, { status: 403 })
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (err) {
    console.error('Image proxy error:', err)
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}

