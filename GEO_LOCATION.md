# Geo-Location Detection System

## Overview
The 4LEEE application includes a comprehensive geo-location detection system powered by Vercel's geo API. This system automatically detects the user's country from their IP address and sets the appropriate locale, currency, language, and regional settings.

## Architecture

### 1. Middleware (`middleware.ts`)
- **Location**: Root of the project
- **Responsibility**: Intercepts all requests and detects country from IP
- **Features**:
  - Uses Vercel's `req.geo?.country` API for IP geolocation
  - Maps country codes (ISO 3166-1 alpha-2) to locales, currencies, and languages
  - Sets persistent cookies for 30 days with proper security flags
  - Adds response headers for server-side access

**Supported Countries**: 40+ countries across Middle East, Southeast Asia, South Asia, Europe, Americas, and Africa

### 2. Geo Utilities (`lib/geo.ts`)
Server-side and client-side utilities for accessing geo-location data.

**Server-side Function** (for Server Components and Route Handlers):
```typescript
const geo = await getGeoLocation()
// Returns: { country: string, locale: string, currency: string, language: string }
```

**Client-side Hook** (for Client Components):
```typescript
const geo = useGeoLocation()
// Returns: { country: string, locale: string, currency: string, language: string }
```

**Helper Functions**:
- `isCountry(country: string | string[])` - Check if user is in specific country/region
- `isRTL(language?: string)` - Detect if language is right-to-left (Arabic, Hebrew, etc.)
- `getCurrencySymbol(currency?: string)` - Get currency symbol (د.إ, ¥, €, etc.)
- `formatPrice(amount: number, currency?: string)` - Format prices with currency symbol
- `getCountryName(countryCode: string)` - Get full country name

### 3. Convenience Hook (`lib/hooks/useGeo.ts`)
Simplifies access to geo data in components.

```typescript
const { country, currency, language, isArabic, isRTL, isMEA, isSEA, formatPrice } = useGeo()
```

**Properties**:
- `country` - ISO 3166-1 alpha-2 country code (e.g., 'AE')
- `locale` - BCP 47 locale code (e.g., 'ae')
- `currency` - ISO 4217 currency code (e.g., 'AED')
- `language` - ISO 639-1 language code (e.g., 'ar')
- `isArabic` - Boolean, true if language is Arabic
- `isRTL` - Boolean, true if language is right-to-left
- `isMEA` - Boolean, true if in Middle East/Africa region
- `isSEA` - Boolean, true if in Southeast Asia region

**Methods**:
- `isCountry(country)` - Check if in specific country
- `getCurrencySymbol()` - Get currency symbol for current region
- `formatPrice(amount)` - Format price with proper currency
- `getCountryName()` - Get full name of current country

## Cookies Set by Middleware

The middleware automatically sets these cookies (30-day expiry):

- `4leee_country` - Country code (e.g., 'AE')
- `4leee_locale` - Locale code (e.g., 'ae')
- `4leee_currency` - Currency code (e.g., 'AED')
- `4leee_language` - Language code (e.g., 'ar')

**Cookie Settings**:
- `maxAge`: 2,592,000 seconds (30 days)
- `path`: '/'
- `sameSite`: 'lax'
- `secure`: Only in production

## Response Headers Set by Middleware

For server-side access, middleware also sets response headers:

- `x-geo-country` - Country code
- `x-geo-locale` - Locale code
- `x-geo-currency` - Currency code
- `x-geo-language` - Language code

## Country to Currency Mapping

| Region | Countries | Currency |
|--------|-----------|----------|
| Middle East/GCC | AE, SA, EG, KW, QA, BH, OM, JO, LB, PS | AED, SAR, EGP, KWD, QAR, BHD, OMR, JOD, LBP |
| Southeast Asia | TH, MY, SG, ID, PH, VN, MM, LA, KH | THB, MYR, SGD, IDR, PHP, VND, MMK, LAK, KHR |
| South Asia | IN, PK, BD, LK, NP | INR, PKR, BDT, LKR, NPR |
| Europe | GB, DE, FR, IT, ES, NL, BE, CH, AT | GBP, EUR, EUR, EUR, EUR, EUR, EUR, CHF, EUR |
| Americas | US, CA, MX, BR, AR | USD, CAD, MXN, BRL, ARS |
| Asia Pacific | CN, JP, KR, TW, HK | CNY, JPY, KRW, TWD, HKD |

## Language Mapping

Arabic-speaking countries default to `ar` language. English is default for most countries. Thai, French, German, Spanish supported for their regions.

## Usage Examples

### Example 1: Server Component with Geo-Aware Pricing
```typescript
import { getGeoLocation, formatPrice } from '@/lib/geo'

export default async function PriceComponent() {
  const { currency } = await getGeoLocation()
  const price = 99.99
  
  return <div>{formatPrice(price, currency)}</div>
}
```

### Example 2: Client Component with Region Detection
```typescript
'use client'

import { useGeo } from '@/lib/hooks/useGeo'

export default function RegionalContent() {
  const { isMEA, country, formatPrice } = useGeo()
  
  if (isMEA) {
    return <div>{formatPrice(100)}</div> // Shows "د.إ 100.00"
  }
  
  return <div>${100.00}</div>
}
```

### Example 3: Language/RTL Detection
```typescript
'use client'

import { useGeo } from '@/lib/hooks/useGeo'

export default function Layout({ children }) {
  const { language, isRTL } = useGeo()
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={language}>
      {children}
    </div>
  )
}
```

### Example 4: Route Handler with Currency Conversion
```typescript
import { getGeoLocation } from '@/lib/geo'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { currency, country } = await getGeoLocation()
  
  // Use currency for pricing API calls
  const prices = await getPricesInCurrency(currency)
  
  return NextResponse.json({ prices, country, currency })
}
```

## Security Considerations

- Cookies are set with `sameSite=lax` to prevent CSRF attacks
- In production, cookies are only sent over HTTPS (`secure` flag)
- Geo detection is based on server-side IP geolocation (Vercel geo API)
- User cannot easily fake their location due to server-side validation
- 30-day cookie expiry prevents stale geo data

## Performance

- Middleware runs on every request but is very fast (< 1ms)
- Static assets are excluded from middleware processing
- Cookies are set only once (first request or after 30 days)
- Header-based access for server components avoids cookie parsing overhead
- Client-side hook uses memoization to prevent re-renders

## Testing

To test geo-location in development:

1. Set `x-vercel-ip-country` header in requests
2. Check browser cookies for `4leee_*` values
3. Use browser dev tools to view Response Headers for `x-geo-*` values

## Future Enhancements

- Add city-level geo-targeting
- Implement geo-based pricing tiers
- Add currency conversion on-the-fly
- Store user's preferred country/currency for later override
- Add analytics for region-specific features
- Implement region-specific payment methods
