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
    <div className="bg-white">
      {/* Price Section */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-bold text-pink-600">฿{price.toFixed(2)}</span>
          <span className="text-lg text-gray-500 line-through">฿{originalPrice.toFixed(2)}</span>
          <span className="text-lg font-bold text-red-600 ml-auto">-{discount}%</span>
        </div>
      </div>

      {/* Product Name and Rating */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-700 mb-2 leading-relaxed">{name}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-gray-900">{rating}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-lg">
                  {'⭐'}
                </span>
              ))}
            </div>
          </div>
          <button className="text-xs text-gray-500 hover:text-gray-700">
            ({reviewCount.toLocaleString()}) <span className="text-pink-600 font-bold">›</span>
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          <span className="text-orange-600 font-bold">{soldCount.toLocaleString()}</span> Sold by Store
        </p>
      </div>

      {/* Tags */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs text-gray-600 mb-2 cursor-pointer hover:text-gray-900">
          {specifications[0]}
          <span className="text-pink-600 ml-2">›</span>
        </p>
      </div>

      {/* Wishlist and Share */}
      <div className="px-4 py-3 flex items-center gap-6 border-b border-gray-100">
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex items-center gap-2 text-orange-600 font-bold text-sm hover:text-orange-700"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          5k+ Add to Wishlist
        </button>
        <button className="flex items-center gap-2 text-gray-600 font-bold text-sm hover:text-gray-700">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
