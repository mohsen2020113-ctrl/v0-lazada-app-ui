"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { ShopifyProduct } from "@/lib/shopify"
import { useI18n } from "@/lib/i18n-context"

interface JustForYouProps {
  products: ShopifyProduct[]
}

const PAGE_SIZE = 20

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function JustForYou({ products }: JustForYouProps) {
  const { t, formatPrice: formatPriceI18n, isRTL } = useI18n()
  const [favorites, setFavorites] = useState<string[]>([])
  const [displayed, setDisplayed] = useState<ShopifyProduct[]>(() => products.slice(0, PAGE_SIZE))
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const poolRef = useRef<ShopifyProduct[]>([...products])
  const offsetRef = useRef(PAGE_SIZE)
  const busyRef = useRef(false)

  // Reset busy after each render
  useEffect(() => {
    busyRef.current = false
  }, [displayed])

  const loadMore = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const pool = poolRef.current
    const offset = offsetRef.current
    if (offset < pool.length) {
      const next = pool.slice(offset, offset + PAGE_SIZE)
      setDisplayed(prev => [...prev, ...next])
      offsetRef.current = offset + PAGE_SIZE
    } else {
      // All shown — Fisher-Yates reshuffle, restart
      const newPool = fisherYatesShuffle(products)
      poolRef.current = newPool
      offsetRef.current = PAGE_SIZE
      setDisplayed(newPool.slice(0, PAGE_SIZE))
    }
  }, [products])

  // Observe horizontal sentinel within the scroll container
  useEffect(() => {
    const sentinel = sentinelRef.current
    const root = scrollRef.current
    if (!sentinel || !root) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { root, rootMargin: '0px 200px 0px 0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  const toggleFavorite = (handle: string) => {
    setFavorites(prev =>
      prev.includes(handle) ? prev.filter(h => h !== handle) : [...prev, handle]
    )
  }

  const isFavorite = (handle: string) => favorites.includes(handle)
  const formatPrice = (amount: string) => formatPriceI18n(parseFloat(amount))

  return (
    <section className="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-gray-100 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-lg font-bold text-gray-900">Just4U</h2>
        <Link
          href="/search"
          className={`text-[#c2185b] text-sm font-semibold flex items-center gap-1 hover:underline ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {t('action.seeAll')} <span>{isRTL ? '‹' : '›'}</span>
        </Link>
      </div>

      {/* Product Horizontal Scroll with infinite loop */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-gray-600 text-center">{t('status.noProducts')}</p>
        </div>
      ) : (
        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 p-3 pb-4">
            {displayed.map((product, idx) => (
              <Link
                key={`${product.id}-${idx}`}
                href={`/product/${product.handle}`}
                className="flex-shrink-0 w-[140px] bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] block"
              >
                <div className="relative aspect-square bg-gray-50">
                  {product.featuredImage?.url && (
                    <img
                      src={product.featuredImage.url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavorite(product.handle)
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorite(product.handle)
                          ? 'fill-[#c2185b] text-[#c2185b]'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-[11px] text-gray-700 line-clamp-1 mb-1 font-medium">
                    {product.title}
                  </p>
                  <p className="text-[#c2185b] font-bold text-[10px]">
                    {formatPrice(product.priceRange.minVariantPrice.amount)}
                  </p>
                </div>
              </Link>
            ))}
            {/* Horizontal sentinel — triggers loadMore as user scrolls near the right end */}
            <div ref={sentinelRef} className="w-1 flex-shrink-0 self-stretch" />
          </div>
        </div>
      )}
    </section>
  )
}
