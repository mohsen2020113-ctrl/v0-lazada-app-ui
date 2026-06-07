'use client'

import { useEffect, useState } from 'react'

// Geo-location data structure
export interface GeoLocation {
  country: string
  locale: string
  currency: string
  language: string
}

// Exchange rates relative to USD (base currency for better global coverage)
// Last updated: 2024 - rates are approximate and update periodically
export const EXCHANGE_RATES: Record<string, number> = {
  // Middle East
  AED: 3.6725,  // UAE Dirham
  SAR: 3.75,    // Saudi Riyal
  KWD: 0.305,   // Kuwaiti Dinar
  QAR: 3.64,    // Qatari Riyal
  BHD: 0.377,   // Bahraini Dinar
  OMR: 0.385,   // Omani Rial
  EGP: 30.5,    // Egyptian Pound
  JOD: 0.71,    // Jordanian Dinar
  LBP: 88000,   // Lebanese Pound
  
  // Southeast Asia
  THB: 33.5,    // Thai Baht
  MYR: 4.35,    // Malaysian Ringgit
  SGD: 1.34,    // Singapore Dollar
  IDR: 15500,   // Indonesian Rupiah
  PHP: 55.5,    // Philippine Peso
  VND: 24300,   // Vietnamese Dong
  MMK: 2100,    // Myanmar Kyat
  LAK: 20500,   // Lao Kip
  KHR: 4100,    // Cambodian Riel
  
  // South Asia
  INR: 83.2,    // Indian Rupee
  PKR: 278,     // Pakistani Rupee
  BDT: 119,     // Bangladeshi Taka
  LKR: 330,     // Sri Lankan Rupee
  NPR: 132,     // Nepalese Rupee
  
  // Europe
  EUR: 0.92,    // Euro
  GBP: 0.79,    // British Pound
  CHF: 0.88,    // Swiss Franc
  
  // Americas
  USD: 1.0,     // US Dollar (base currency)
  CAD: 1.36,    // Canadian Dollar
  MXN: 17.2,    // Mexican Peso
  BRL: 4.97,    // Brazilian Real
  ARS: 850,     // Argentine Peso
  
  // Asia Pacific
  CNY: 7.24,    // Chinese Yuan
  JPY: 149.5,   // Japanese Yen
  KRW: 1310,    // South Korean Won
  TWD: 32.5,    // Taiwan Dollar
  HKD: 7.81,    // Hong Kong Dollar
  
  // Africa
  NGN: 1550,    // Nigerian Naira
  ZAR: 18.2,    // South African Rand
  KES: 129,     // Kenyan Shilling
  GHS: 12.5,    // Ghanaian Cedi
  ETB: 56,      // Ethiopian Birr
  
  // Other
  TRY: 32.5,    // Turkish Lira
  RUB: 101,     // Russian Ruble
  UAH: 40.5,    // Ukrainian Hryvnia
}

// Currency metadata
export interface CurrencyMetadata {
  symbol: string
  name: string
  nameAr: string
  position: 'before' | 'after'
  decimals: number
  locale: string
}

export const CURRENCY_METADATA: Record<string, CurrencyMetadata> = {
  AED: { symbol: 'د.إ', name: 'UAE Dirham', nameAr: 'الدرهم الإماراتي', position: 'after', decimals: 2, locale: 'ar-AE' },
  SAR: { symbol: '﷼', name: 'Saudi Riyal', nameAr: 'الريال السعودي', position: 'after', decimals: 2, locale: 'ar-SA' },
  USD: { symbol: '$', name: 'US Dollar', nameAr: 'الدولار الأمريكي', position: 'before', decimals: 2, locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro', nameAr: 'اليورو', position: 'before', decimals: 2, locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound', nameAr: 'الجنيه الإسترليني', position: 'before', decimals: 2, locale: 'en-GB' },
  THB: { symbol: '฿', name: 'Thai Baht', nameAr: 'الباط التايلاندي', position: 'after', decimals: 2, locale: 'th-TH' },
  INR: { symbol: '₹', name: 'Indian Rupee', nameAr: 'الروبية الهندية', position: 'before', decimals: 2, locale: 'en-IN' },
  JPY: { symbol: '¥', name: 'Japanese Yen', nameAr: 'الين الياباني', position: 'before', decimals: 0, locale: 'ja-JP' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', nameAr: 'اليوان الصيني', position: 'before', decimals: 2, locale: 'zh-CN' },
  KRW: { symbol: '₩', name: 'South Korean Won', nameAr: 'الوون الكوري الجنوبي', position: 'before', decimals: 0, locale: 'ko-KR' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', nameAr: 'رينجيت ماليزيا', position: 'before', decimals: 2, locale: 'ms-MY' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', nameAr: 'دولار سنغافورة', position: 'before', decimals: 2, locale: 'en-SG' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', nameAr: 'روبية إندونيسيا', position: 'before', decimals: 0, locale: 'id-ID' },
  PHP: { symbol: '₱', name: 'Philippine Peso', nameAr: 'البيزو الفلبيني', position: 'before', decimals: 2, locale: 'en-PH' },
  VND: { symbol: '₫', name: 'Vietnamese Dong', nameAr: 'الدونج الفيتنامي', position: 'after', decimals: 0, locale: 'vi-VN' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', nameAr: 'الدولار الكندي', position: 'before', decimals: 2, locale: 'en-CA' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', nameAr: 'الدولار الأسترالي', position: 'before', decimals: 2, locale: 'en-AU' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', nameAr: 'دولار نيوزيلندا', position: 'before', decimals: 2, locale: 'en-NZ' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', nameAr: 'الفرنك السويسري', position: 'before', decimals: 2, locale: 'de-CH' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', nameAr: 'الكرونة السويدية', position: 'after', decimals: 2, locale: 'sv-SE' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', nameAr: 'الكرونة النرويجية', position: 'after', decimals: 2, locale: 'nb-NO' },
  ZAR: { symbol: 'R', name: 'South African Rand', nameAr: 'الراند الجنوب أفريقي', position: 'before', decimals: 2, locale: 'en-ZA' },
  TRY: { symbol: '₺', name: 'Turkish Lira', nameAr: 'الليرة التركية', position: 'before', decimals: 2, locale: 'tr-TR' },
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
 * Get currency symbol for a specific currency
 */
export function getCurrencySymbol(currency?: string): string {
  const curr = currency || 'AED'
  return CURRENCY_METADATA[curr]?.symbol || curr
}

/**
 * Format price for display with currency symbol and locale formatting
 * Supports both before and after symbol placement (e.g., $100 vs 100 ฿)
 */
export function formatPrice(amount: number, currency?: string, localize: boolean = true): string {
  const curr = currency || 'AED'
  const metadata = CURRENCY_METADATA[curr]
  
  if (!metadata) {
    return `${curr} ${amount.toFixed(2)}`
  }

  const formatted = localize 
    ? amount.toLocaleString(metadata.locale, { 
        minimumFractionDigits: metadata.decimals, 
        maximumFractionDigits: metadata.decimals 
      })
    : amount.toFixed(metadata.decimals)

  const symbol = metadata.symbol
  return metadata.position === 'before' 
    ? `${symbol} ${formatted}` 
    : `${formatted} ${symbol}`
}

/**
 * Convert price from one currency to another using exchange rates
 * Base currency is USD
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, precision: number = 2): number {
  const fromRate = EXCHANGE_RATES[fromCurrency]
  const toRate = EXCHANGE_RATES[toCurrency]
  
  if (!fromRate || !toRate) {
    console.warn(`[v0] Exchange rate not found for ${fromCurrency} or ${toCurrency}`)
    return amount
  }

  // Convert to USD first, then to target currency
  const inUSD = amount / fromRate
  const converted = inUSD * toRate
  
  return parseFloat(converted.toFixed(precision))
}

/**
 * Convert price from AED to target currency (convenience function)
 * Assumes input is in AED (default base for 4LEEE)
 */
export function convertFromAED(amount: number, toCurrency: string, precision: number = 2): number {
  if (toCurrency === 'AED') return amount
  return convertCurrency(amount, 'AED', toCurrency, precision)
}

/**
 * Convert price to AED from source currency (convenience function)
 * Converts any currency to AED (default base for 4LEEE)
 */
export function convertToAED(amount: number, fromCurrency: string, precision: number = 2): number {
  if (fromCurrency === 'AED') return amount
  return convertCurrency(amount, fromCurrency, 'AED', precision)
}

/**
 * Get the exchange rate between two currencies
 * Returns rate as: amount_in_from_currency * rate = amount_in_to_currency
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string, precision: number = 4): number {
  const fromRate = EXCHANGE_RATES[fromCurrency]
  const toRate = EXCHANGE_RATES[toCurrency]
  
  if (!fromRate || !toRate) {
    console.warn(`[v0] Exchange rate not found`)
    return 1
  }

  const rate = toRate / fromRate
  return parseFloat(rate.toFixed(precision))
}

/**
 * Format price in current currency with conversion from AED
 * Useful for displaying prices in user's local currency
 */
export function formatPriceInCurrency(aedAmount: number, toCurrency: string = 'AED', localize: boolean = true): string {
  const converted = convertFromAED(aedAmount, toCurrency, CURRENCY_METADATA[toCurrency]?.decimals || 2)
  return formatPrice(converted, toCurrency, localize)
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
  // Geo utilities
  getGeoLocation,
  useGeoLocation,
  isCountry,
  isRTL,
  getCountryName,
  
  // Currency utilities
  getCurrencySymbol,
  formatPrice,
  convertCurrency,
  convertFromAED,
  convertToAED,
  getExchangeRate,
  formatPriceInCurrency,
  
  // Constants
  EXCHANGE_RATES,
  CURRENCY_METADATA,
}
