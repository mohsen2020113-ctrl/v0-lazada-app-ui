import { NextRequest, NextResponse } from 'next/server'

// Country to locale mapping (ISO 3166-1 alpha-2 to BCP 47 locale)
const COUNTRY_LOCALE: Record<string, string> = {
  // Middle East & GCC
  AE: 'ae', SA: 'sa', EG: 'eg', KW: 'kw', QA: 'qa', BH: 'bh', OM: 'om', JO: 'jo', LB: 'lb', PS: 'ps',
  // Southeast Asia
  TH: 'th', MY: 'my', SG: 'sg', ID: 'id', PH: 'ph', VN: 'vn', MM: 'mm', LA: 'la', KH: 'kh',
  // South Asia
  IN: 'in', PK: 'pk', BD: 'bd', LK: 'lk', NP: 'np',
  // Europe
  GB: 'gb', DE: 'de', FR: 'fr', IT: 'it', ES: 'es', NL: 'nl', BE: 'be', CH: 'ch', AT: 'at', PL: 'pl',
  // Americas
  US: 'us', CA: 'ca', MX: 'mx', BR: 'br', AR: 'ar',
  // Asia Pacific
  CN: 'cn', JP: 'jp', KR: 'kr', TW: 'tw', HK: 'hk',
  // Africa
  NG: 'ng', ZA: 'za', KE: 'ke', GH: 'gh', ET: 'et',
  // Other
  TR: 'tr', RU: 'ru', UA: 'ua',
}

// Country to currency mapping (ISO 4217)
const COUNTRY_CURRENCY: Record<string, string> = {
  // Middle East
  AE: 'AED', SA: 'SAR', EG: 'EGP', KW: 'KWD', QA: 'QAR', BH: 'BHD', OM: 'OMR', JO: 'JOD', LB: 'LBP',
  // Southeast Asia
  TH: 'THB', MY: 'MYR', SG: 'SGD', ID: 'IDR', PH: 'PHP', VN: 'VND', MM: 'MMK', LA: 'LAK', KH: 'KHR',
  // South Asia
  IN: 'INR', PK: 'PKR', BD: 'BDT', LK: 'LKR', NP: 'NPR',
  // Europe
  GB: 'GBP', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', CH: 'CHF', AT: 'EUR',
  // Americas
  US: 'USD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS',
  // Asia Pacific
  CN: 'CNY', JP: 'JPY', KR: 'KRW', TW: 'TWD', HK: 'HKD',
  // Africa
  NG: 'NGN', ZA: 'ZAR', KE: 'KES', GH: 'GHS', ET: 'ETB',
  // Other
  TR: 'TRY', RU: 'RUB', UA: 'UAH',
}

// Country to language mapping
const COUNTRY_LANGUAGE: Record<string, string> = {
  // Arabic-speaking
  AE: 'ar', SA: 'ar', EG: 'ar', KW: 'ar', QA: 'ar', BH: 'ar', OM: 'ar', JO: 'ar', LB: 'ar', PS: 'ar',
  // English-speaking
  GB: 'en', US: 'en', CA: 'en', AU: 'en', NZ: 'en', IN: 'en', SG: 'en', MY: 'en',
  // UAE
  TH: 'ae',
  // French
  FR: 'fr', BE: 'fr', CH: 'fr',
  // German
  DE: 'de', AT: 'de', CH: 'de',
  // Spanish
  ES: 'es', MX: 'es', AR: 'es',
  // Others default to English
}

const STATIC_PREFIXES = ['/api/', '/_next/', '/favicon.ico', '/images/', '/fonts/', '/icons/']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip static assets
  if (STATIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check if path already has locale prefix
  const locales = Object.values(COUNTRY_LOCALE)
  const hasLocale = locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  // Detect country from Vercel geo header or headers
  const country = req.geo?.country || req.headers.get('x-vercel-ip-country') || 'AE'
  const locale = COUNTRY_LOCALE[country] || 'ae'
  const currency = COUNTRY_CURRENCY[country] || 'AED'
  const language = COUNTRY_LANGUAGE[country] || 'en'

  // Create response and set geo-location cookies
  const response = NextResponse.next()
  response.cookies.set('4leee_country', country, { 
    maxAge: 86400 * 30, // 30 days
    paur: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  response.cookies.set('4leee_locale', locale, { 
    maxAge: 86400 * 30,
    paur: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  response.cookies.set('4leee_currency', currency, { 
    maxAge: 86400 * 30,
    paur: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  response.cookies.set('4leee_language', language, { 
    maxAge: 86400 * 30,
    paur: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  
  // Add geo-location headers for server components
  response.headers.set('x-geo-country', country)
  response.headers.set('x-geo-locale', locale)
  response.headers.set('x-geo-currency', currency)
  response.headers.set('x-geo-language', language)

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts|icons).*)'],
}
