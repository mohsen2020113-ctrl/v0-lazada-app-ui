'use client'

import { Heart, MessageCircle, ShoppingCart, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function LiveShoppingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-700 px-4 py-4">
        <h1 className="text-2xl font-bold">Live Shopping</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        {/* Video Player - Main */}
        <div className="lg:col-span-3">
          <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gray-400">Live stream player</p>
            </div>
          </div>

          {/* Live Products Carousel */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Now Featuring</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={`https://via.placeholder.com/150x150?text=Product${i + 1}`} alt={`Product ${i + 1}`} className="w-full aspect-square object-cover" />
                  <div className="p-2">
                    <p className="font-bold text-sm mb-1">Live Product {i + 1}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-lg font-bold text-pink-600">฿{(50 + Math.random() * 100).toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-pink-600 text-white py-1.5 rounded font-bold hover:bg-pink-700 transition-colors text-sm">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Chat & Seller Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Seller Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-xl">👤</div>
              <div>
                <h3 className="font-bold">Live Seller</h3>
                <p className="text-xs text-gray-400">Online now</p>
              </div>
            </div>
            <button className="w-full bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700 transition-colors mb-2">Follow</button>
            <button className="w-full border border-pink-600 text-pink-600 py-2 rounded-lg font-bold hover:bg-pink-600/10 transition-colors">Visit Store</button>
          </div>

          {/* Live Chat */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-64">
            <h3 className="font-bold mb-3 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Live Chat</h3>
            <div className="flex-1 overflow-y-auto mb-3 space-y-2 text-sm">
              <div><span className="text-pink-400">Seller:</span> <span className="text-gray-300">Welcome to our live shopping!</span></div>
              <div><span className="text-blue-400">John:</span> <span className="text-gray-300">Great deals today!</span></div>
              <div><span className="text-green-400">Sarah:</span> <span className="text-gray-300">Is this available?</span></div>
            </div>
            <input type="text" placeholder="Say something..." className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-600" />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"><Heart className="w-5 h-5 text-pink-600" /> <span className="text-sm">Like</span></button>
            <button className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"><Share2 className="w-5 h-5 text-blue-400" /> <span className="text-sm">Share</span></button>
            <button className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"><ShoppingCart className="w-5 h-5 text-orange-400" /> <span className="text-sm">Cart</span></button>
          </div>
        </div>
      </div>
    </div>
  )
}
