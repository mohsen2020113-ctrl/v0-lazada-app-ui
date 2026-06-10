'use client'

import { Heart, RefreshCw, Share2, ChevronRight } from 'lucide-react'

interface ProductHeaderProps {
  productName: string
  rating: number
  reviewCount: number
  cartCount: number
}

export function ProductHeader({ productName, rating, reviewCount, cartCount }: ProductHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Search Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search in 4LEEE"
            className="w-full px-3 py-2 bg-gray-100 rounded-full border border-pink-500 text-sm"
          />
        </div>

        <button className="p-1 hover:bg-gray-100 rounded">
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative">
          <button className="p-1 hover:bg-gray-100 rounded">
            {/* Cart icon SVG */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.21 5M17 13v6m-4-6v6m-5-6v6M9 5a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>

        <button className="text-xs font-bold text-gray-600">...99+</button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-6 px-4 py-3 overflow-x-auto">
        <button className="text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap">
          Overview
        </button>
        <button className="text-pink-600 font-bold text-sm border-b-2 border-pink-600 pb-3 whitespace-nowrap">
          Reviews
        </button>
        <button className="text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap">
          Product Details
        </button>
        <button className="text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap">
          Recommendations
        </button>
      </div>
    </div>
  )
}
