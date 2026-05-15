"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { ShopifyProduct } from "@/lib/shopify"
import { useI18n } from "@/lib/i18n-context"

interface JustForYouProps {
  products: ShopifyProduct[]
}

export function JustForYou({ products }: JustForYouProps) {
  const { t, formatPrice: formatPriceI18n, isRTL } = useI18n()
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (handle: string) => {
    setFavorites(prev =>
      prev.includes(handle)
        ? prev.filter(h => h !== handle)
        : [...prev, handle]
    )
  }

  const isFavorite = (handle: string) => favorites.includes(handle)

  const formatPrice = (amount: string) => {
    return formatPriceI18n(parseFloat(amount))
  }

  const displayProducts = products.slice(0, 8)

  return (
    <section className="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-gray-100 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-lg font-bold text-gray-900">Just4U</h2>
        <Link 
          href="/search"
          className={`text-[#f85c98] text-sm font-semibold flex items-center gap-1 hover:underline ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {t('action.seeAll')} <span>{isRTL ? '‹' : '›'}</span>
        </Link>
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
                href={`/product/${product.handle}`}
                className="flex-shrink-0 w-[140px] bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] block"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50">
                  {product.featuredImage?.url && (
                    <img
                      src={product.featuredImage.url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Favorite button */}
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
                          ? 'fill-[#f85c98] text-[#f85c98]'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
                
                {/* Product Info */}
                <div className="p-2">
                  {/* Title */}
                  <p className="text-[11px] text-gray-700 line-clamp-1 mb-1 font-medium">
                    {product.title}
                  </p>
                  
                  {/* Price */}
                  <p className="text-[#f85c98] font-bold text-[10px]">
                    {formatPrice(product.priceRange.minVariantPrice.amount)}
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
