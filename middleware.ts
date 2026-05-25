import { NextRequest, NextResponse } from 'next/server'

const COUNTRY_LOCALE: Record<string, string> = {
  AE: 'ae', SA: 'sa', EG: 'eg', KW: 'kw', QA: 'qa', BH: 'bh', OM: 'om',
  TH: 'th', MY: 'my', SG: 'sg', ID: 'id', PH: 'ph', VN: 'vn', MM: 'mm',
  IN: 'in', PK: 'pk', BD: 'bd', LK: 'lk', NP: 'np', TR: 'tr',
  GB: 'gb', DE: 'de', FR: 'fr', IT: 'it', ES: 'es',
  US: 'us', CA: 'ca', AU: 'au', NZ: 'nz',
  CN: 'cn', JP: 'jp', KR: 'kr',
  NG: 'ng', ZA: 'za', KE: 'ke', GH: 'gh',
}

const STATIC_PREFIXES = ['/api/', '/_next/', '/favicon.ico', '/images/', '/fonts/', '/icons/']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (STATIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const locales = Object.values(COUNTRY_LOCALE)
  const hasLocale = locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  const country = req.geo?.country || req.headers.get('x-vercel-ip-country') || 'AE'
  const locale = COUNTRY_LOCALE[country] || 'ae'

  const response = NextResponse.next()
  response.cookies.set('lee_country', country, { maxAge: 86400, path: '/' })
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts|icons).*)'],
}
