import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * Proxy external images (Google Drive, etc.) to avoid CORS/interstitial issues.
 * Usage: /api/image-proxy?url=<encoded_url>
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    // For Google Drive, follow redirects and get the actual image
    const res = await fetch(url, {
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
        const confirmUrl = `${url}&confirm=${confirmMatch[1]}`
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

