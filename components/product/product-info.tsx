'use client'

import { Heart, Share2 } from 'lucide-react'
import { useState } from 'react'

interface ProductInfoProps {
  name: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  soldCount: number
  tags: string[]
  specifications: string[]
}

export function ProductInfo({
  name,
  price,
  originalPrice,
  discount,
  rating,
  reviewCount,
  soldCount,
  tags,
  specifications,
}: ProductInfoProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      {/* Price Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl font-bold text-pink-600">฿{price.toFixed(2)}</span>
          <span className="text-xl text-gray-400 line-through">฿{originalPrice.toFixed(2)}</span>
          <span className="ml-auto bg-red-600 text-white px-2 py-1 rounded font-bold text-sm">-{discount}%</span>
        </div>
      </div>

      {/* Product Name */}
      <div className="p-4 border-b border-gray-100">
        <p className="text-sm text-gray-800 font-medium leading-relaxed mb-3">{name}</p>
        
        {/* Rating and Reviews */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-gray-900">{rating}</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-lg">⭐</span>
              ))}
            </div>
          </div>
          <button className="text-xs text-gray-500 font-medium">
            ({reviewCount.toLocaleString()})
          </button>
        </div>

        {/* Sold Count */}
        <p className="text-xs text-gray-600">
          <span className="text-orange-600 font-bold">{soldCount}</span> Sold by Store
        </p>
      </div>

      {/* Tags/Categories */}
      {tags.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist and Share */}
      <div className="p-4 flex items-center gap-6">
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex items-center gap-2 text-orange-600 font-bold text-sm hover:text-orange-700 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          5k+ Add to Wishlist
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

