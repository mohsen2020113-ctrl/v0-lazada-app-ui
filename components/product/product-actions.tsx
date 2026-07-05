'use client'

import { Store, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface ProductActionsProps {
  sellerId: string
  sellerName: string
  price: number
}

export function ProductActions({ sellerId, sellerName, price }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
      {/* Seller Info */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-2xl">🏪</div>
          <div>
            <p className="font-bold text-sm text-gray-900">{sellerName}</p>
            <p className="text-xs text-gray-600">Official Store</p>
          </div>
        </div>
        <button className="bg-pink-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-pink-700 transition">
          Visit Store
        </button>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* Store */}
        <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded transition">
          <Store className="w-5 h-5 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Store</span>
        </button>

        {/* Chat */}
        <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded transition">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Chat</span>
        </button>

        {/* Spacer */}
        <div />
        <div />
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
          <span>🛒</span>
          <span>Buy Now</span>
        </button>
        <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
          <span>❤️</span>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}
