import { NextRequest, NextResponse } from 'next/server'

const COUNTRY_COOKIE = 'lee_country'
const DEFAULT_COUNTRY = 'AE'

// Derive country from Accept-Language or CF-IPCountry header
function detectCountry(req: NextRequest): string {
  const cfCountry = req.headers.get('cf-ipcountry')
  if (cfCountry && cfCountry !== 'XX') return cfCountry.toUpperCase()

  const acceptLang = req.headers.get('accept-language') ?? ''
  const match = acceptLang.match(/[-_]([A-Z]{2})/i)
  if (match) return match[1].toUpperCase()

  return DEFAULT_COUNTRY
}

export function middleware(req: NextRequest) {
  const response = NextResponse.next()

  // Only set the cookie if it's not already present — prevents CDN cache bypass
  const existingCountry = req.cookies.get(COUNTRY_COOKIE)?.value
  if (!existingCountry) {
    const country = detectCountry(req)
    response.cookies.set(COUNTRY_COOKIE, country, {
      maxAge: 86400,
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
