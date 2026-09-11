'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useState } from 'react'

interface SimilarProduct {
  id: string
  handle: string
  name: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  soldCount: number
  images: string[]
  tags: string[]
}

interface SimilarProductsProps {
  products: SimilarProduct[]
  storeProducts?: SimilarProduct[]
}

export function SimilarProducts({ products, storeProducts }: SimilarProductsProps) {
  const [activeTab, setActiveTab] = useState<'same-store' | 'similar'>('same-store')
  const displayProducts = activeTab === 'same-store' ? storeProducts || products : products

  return (
    <div className="bg-white px-4 py-4 border-b border-gray-100">
      {/* Tabs */}
      <div className="flex gap-6 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('same-store')}
          className={`pb-3 font-bold text-sm transition ${
            activeTab === 'same-store'
              ? 'text-gray-900 border-b-2 border-pink-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Same store
        </button>
        <button
          onClick={() => setActiveTab('similar')}
          className={`pb-3 font-bold text-sm transition ${
            activeTab === 'similar'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Similar items
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {displayProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.handle}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition group"
          >
            {/* Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -{product.discount}%
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-lg transition"
              >
                <Heart className="w-4 h-4 text-pink-600" />
              </button>
            </div>

            {/* Info */}
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1 h-8">
                {product.name}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm font-bold text-pink-600">
                  ฿{product.price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ฿{product.originalPrice.toFixed(2)}
                </span>
              </div>

              {/* Rating and Sold */}
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-gray-900">{product.rating}</span>
                <span className="text-yellow-400">★</span>
                <span className="text-gray-600">
                  {product.soldCount.toLocaleString()} sold
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
