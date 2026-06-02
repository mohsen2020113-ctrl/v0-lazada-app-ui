'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

interface RecommendedProduct {
  id: string
  handle?: string
  title: string
  price: string
  image?: string
  reason: string
  reasonAr?: string
  score?: number
}

interface RecGPTV2Props {
  userId?: string
  limit?: number
}

export function RecGPTV2({ userId, limit = 12 }: RecGPTV2Props) {
  const { t, isRTL, formatPrice, locale } = useI18n()
  const [products, setProducts] = useState<RecommendedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [strategy, setStrategy] = useState<string>('')

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/recommend/v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId || undefined,
            limit,
            geo: 'ae',
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
          setStrategy(data.strategy || '')
        }
      } catch (error) {
        console.error('[v0] RecGPT V2 error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId, limit])

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const isFavorite = (id: string) => favorites.includes(id)

  const displayProducts = products.slice(0, 12)
  const reasonText = locale === 'ar' ? 'reasonAr' : 'reason'

  if (loading) {
    return (
      <section className="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="flex gap-2 p-3 pb-4 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[130px] bg-gray-100 rounded-lg animate-pulse aspect-square" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-gray-100 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-lg font-bold text-gray-900">
            {isRTL ? 'خصيصًا لك' : 'Just For You'}
          </h2>
          <span className="text-[10px] bg-gradient-to-r from-[#f85c98] to-[#f57224] text-white px-2 py-1 rounded-full font-semibold whitespace-nowrap">
            {isRTL ? 'بواسطة Mercury AI' : 'Powered by Mercury AI'}
          </span>
        </div>
        <span className="text-[10px] text-gray-500">{strategy}</span>
      </div>

      {/* Product Horizontal Scroll */}
      {displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-gray-600 text-center">{t('status.noProducts')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 p-3 pb-4">
            {displayProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.handle || product.id}`}
                className="flex-shrink-0 w-[130px] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] block"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavorite(product.id)
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorite(product.id)
                          ? 'fill-[#f85c98] text-[#f85c98]'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-2">
                  {/* Title */}
                  <p className="text-[10px] text-gray-700 line-clamp-1 mb-1 font-medium">
                    {product.title}
                  </p>

                  {/* Price */}
                  <p className="text-[#f85c98] font-bold text-[9px] mb-1">
                    AED {parseFloat(product.price).toFixed(2)}
                  </p>

                  {/* Reason */}
                  <p className={`text-[8px] text-gray-500 line-clamp-2 leading-tight ${isRTL ? 'text-right' : ''}`}>
                    {product[reasonText as keyof RecommendedProduct] || product.reason}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
