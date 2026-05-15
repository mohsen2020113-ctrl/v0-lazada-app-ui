'use client'

import { useCallback } from 'react'

interface TrackEventOptions {
  userId?: string
  data?: Record<string, any>
}

export function useEvents() {
  const trackEvent = useCallback(async (event: string, options?: TrackEventOptions) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: options?.userId,
          event,
          data: options?.data || {},
        }),
      })
    } catch (error) {
      console.error('[v0] Event tracking failed:', error)
    }
  }, [])

  const trackProductView = useCallback(
    (productId: string, userId?: string, metadata?: Record<string, any>) => {
      return trackEvent('product_view', {
        userId,
        data: { productId, ...metadata },
      })
    },
    [trackEvent]
  )

  const trackAddToCart = useCallback(
    (productId: string, price: number, userId?: string, metadata?: Record<string, any>) => {
      return trackEvent('add_to_cart', {
        userId,
        data: { productId, price, ...metadata },
      })
    },
    [trackEvent]
  )

  const trackSearch = useCallback(
    (query: string, userId?: string, resultsCount?: number) => {
      return trackEvent('search', {
        userId,
        data: { query, resultsCount },
      })
    },
    [trackEvent]
  )

  return { trackEvent, trackProductView, trackAddToCart, trackSearch }
}
