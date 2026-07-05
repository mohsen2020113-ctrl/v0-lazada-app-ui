'use client'

import { Heart, RefreshCw, Share2, ChevronLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface ProductHeaderProps {
  productName: string
  rating: number
  reviewCount: number
  cartCount: number
}

export function ProductHeader({ productName, rating, reviewCount, cartCount }: ProductHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Search Bar */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
        {/* Back Button */}
        <Link
          href="/category"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="flex items-center px-4 py-2.5 bg-white border-2 border-pink-500 rounded-full">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search in 4LEEE"
              className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Refresh Icon */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>

        {/* Cart Icon */}
        <div className="relative flex-shrink-0">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </button>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>

        {/* Menu Badge */}
        <button className="px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
          ...99+
        </button>
      </div>
    </div>
  )
}

