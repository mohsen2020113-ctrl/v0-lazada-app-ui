'use client'

import { Heart, MessageCircle, ShoppingCart, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function LiveShoppingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-700 px-4 py-4">
        <h1 className="text-2xl font-bold">Live Shopping</h1>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        {/* Video Player - Main */}
        <div className="lg:col-span-3">
          <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gray-400">Live stream player</p>
            </div>
          </div>
=======
      {/* Featured Live */}
      <div className="mx-4 mb-5 rounded-2xl overflow-hidden bg-[#1A1A1A]">
        <div className="relative h-48 bg-gradient-to-br from-[#C2185B]/20 to-[#1A1A1A] flex items-center justify-center">
          <span className="text-8xl">{STREAMS[3].emoji}</span>
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
          </div>
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            <Eye size={12} /> {STREAMS[3].viewers.toLocaleString()}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-bold text-sm">{STREAMS[3].title}</p>
            <p className="text-white/60 text-xs">{STREAMS[3].host}</p>
          </div>
        </div>
        <div className="flex gap-2 p-3">
          <button className="flex-1 bg-[#C2185B] text-white py-2.5 rounded-xl text-sm font-bold">مشاهدة</button>
          <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Heart size={16} className="text-white" /></button>
          <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Share2 size={16} className="text-white" /></button>
        </div>
      </div>
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2

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
