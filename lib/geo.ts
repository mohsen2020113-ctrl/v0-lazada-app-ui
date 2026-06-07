'use client'

import { useEffect, useState } from 'react'
import { cookies } from 'next/headers'

// Geo-location data structure
export interface GeoLocation {
  country: string
  locale: string
  currency: string
  language: string
}

// Default to Middle East (UAE)
const DEFAULT_GEO: GeoLocation = {
  country: 'AE',
  locale: 'ae',
  currency: 'AED',
  language: 'ar',
}

/**
 * Get geo-location from cookies
 * Server-side only - use in Server Components and Route Handlers
 */
export async function getGeoLocation(): Promise<GeoLocation> {
  try {
    const cookieStore = await cookies()
    return {
      country: cookieStore.get('4leee_country')?.value || DEFAULT_GEO.country,
      locale: cookieStore.get('4leee_locale')?.value || DEFAULT_GEO.locale,
      currency: cookieStore.get('4leee_currency')?.value || DEFAULT_GEO.currency,
      language: cookieStore.get('4leee_language')?.value || DEFAULT_GEO.language,
    }
  } catch (error) {
    return DEFAULT_GEO
  }
}

/**
 * Hook to get geo-location on client-side
 * Client-side only - use in Client Components
 */
export function useGeoLocation(): GeoLocation {
  const [geo, setGeo] = useState<GeoLocation>(DEFAULT_GEO)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Read from cookie strings
      const getCookie = (name: string): string => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
        return ''
      }

      setGeo({
        country: getCookie('4leee_country') || DEFAULT_GEO.country,
        locale: getCookie('4leee_locale') || DEFAULT_GEO.locale,
        currency: getCookie('4leee_currency') || DEFAULT_GEO.currency,
        language: getCookie('4leee_language') || DEFAULT_GEO.language,
      })
    } catch (error) {
      console.error('[v0] Error reading geo cookies:', error)
      setGeo(DEFAULT_GEO)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return geo
}

/**
 * Check if user is in a specific country/region
 */
export function isCountry(country: string | string[]): boolean {
  const countries = Array.isArray(country) ? country : [country]
  try {
    const value = `; ${document.cookie}`
    const parts = value.split('; 4leee_country=')
    if (parts.length === 2) {
      const userCountry = parts.pop()?.split(';').shift() || ''
      return countries.includes(userCountry)
    }
  } catch (error) {
    console.error('[v0] Error checking country:', error)
  }
  return false
}

/**
 * Check if language is RTL (Right-to-Left)
 */
export function isRTL(language?: string): boolean {
  const lang = language || (typeof document !== 'undefined' ? document.documentElement.lang : 'en')
  return ['ar', 'he', 'fa', 'ur'].includes(lang)
}

/**
 * Get currency symbol for current geo
 */
export function getCurrencySymbol(currency?: string): string {
  const currencySymbols: Record<string, string> = {
    AED: 'د.إ',
    SAR: '﷼',
    EGP: '£',
    THB: '฿',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CNY: '¥',
    KRW: '₩',
    MYR: 'RM',
    SGD: 'S$',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
  }
  return currencySymbols[currency || 'AED'] || currency || 'AED'
}

/**
 * Format price for display with geo-location aware currency
 */
export function formatPrice(amount: number, currency?: string): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Get country name from country code
 */
export function getCountryName(countryCode: string): string {
  const countryNames: Record<string, string> = {
    AE: 'United Arab Emirates',
    SA: 'Saudi Arabia',
    EG: 'Egypt',
    TH: 'Thailand',
    MY: 'Malaysia',
    SG: 'Singapore',
    ID: 'Indonesia',
    PH: 'Philippines',
    VN: 'Vietnam',
    IN: 'India',
    US: 'United States',
    GB: 'United Kingdom',
    FR: 'France',
    DE: 'Germany',
    CN: 'China',
    JP: 'Japan',
    KR: 'South Korea',
    BR: 'Brazil',
    MX: 'Mexico',
    CA: 'Canada',
    AU: 'Australia',
  }
  return countryNames[countryCode] || countryCode
}

export default {
  getGeoLocation,
  useGeoLocation,
  isCountry,
  isRTL,
  getCurrencySymbol,
  formatPrice,
  getCountryName,
}
