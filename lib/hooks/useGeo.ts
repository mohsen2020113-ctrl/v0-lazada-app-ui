'use client'

import { useGeoLocation, isCountry, isRTL, getCurrencySymbol, formatPrice, getCountryName } from '@/lib/geo'
import type { GeoLocation } from '@/lib/geo'

/**
 * useGeo Hook - Convenience wrapper for geo utilities
 * Provides access to geo-location data and helper functions
 * 
 * Usage:
 * const { country, currency, isArabic, formatPrice } = useGeo()
 */
export function useGeo() {
  const geo = useGeoLocation()
  
  return {
    // Raw geo data
    country: geo.country,
    locale: geo.locale,
    currency: geo.currency,
    language: geo.language,
    
    // Helper functions
    isArabic: geo.language === 'ar',
    isRTL: isRTL(geo.language),
    isMEA: ['ae', 'sa', 'eg', 'kw', 'qa', 'bh', 'om', 'jo', 'lb'].includes(geo.locale),
    isSEA: ['ae', 'my', 'sg', 'id', 'ph', 'vn', 'mm', 'la', 'kh'].includes(geo.locale),
    
    // Utility functions
    isCountry: (country: string | string[]) => isCountry(country),
    getCurrencySymbol: () => getCurrencySymbol(geo.currency),
    formatPrice: (amount: number) => formatPrice(amount, geo.currency),
    getCountryName: () => getCountryName(geo.country),
    
    // Full geo object
    geo,
  }
}

export type UseGeoReturn = ReturnType<typeof useGeo>

export default useGeo
