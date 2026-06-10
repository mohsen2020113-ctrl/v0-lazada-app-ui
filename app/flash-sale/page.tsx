'use client'

import { Heart, Flame } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const mockProducts = Array(8).fill(null).map((_, i) => ({ id: i + 1, name: `Flash Sale Product ${i + 1}`, price: 30 + Math.random() * 100, originalPrice: 100 + Math.random() * 200, discount: 58, rating: 4.5 + Math.random() * 0.4, reviews: 100 + Math.random() * 9900, image: `https://via.placeholder.com/200x200?text=Product${i + 1}`, sold: 100 + Math.random() * 9900 }))

function CountdownTimer() {
  const [time, setTime] = useState(3600)

  useEffect(() => {
    const interval = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(time / 3600), minutes = Math.floor((time % 3600) / 60), seconds = time % 60
  return <div className="flex gap-1 font-bold text-sm"><span className="bg-red-600 text-white px-2 py-1 rounded">{String(hours).padStart(2, '0')}</span><span className="text-red-600">:</span><span className="bg-red-600 text-white px-2 py-1 rounded">{String(minutes).padStart(2, '0')}</span><span className="text-red-600">:</span><span className="bg-red-600 text-white px-2 py-1 rounded">{String(seconds).padStart(2, '0')}</span></div>
}

export default function FlashSalePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3"><Flame className="w-8 h-8" /><div><h1 className="text-3xl font-bold">Flash Sale</h1><p className="text-red-100 text-sm">Limited time deals - Ends in</p></div></div>
            <CountdownTimer />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white border-l-4 border-red-600 rounded-lg p-6 mb-8"><h2 className="text-2xl font-bold text-gray-900 mb-2">Up to 58% Off Today!</h2><p className="text-gray-600">Flash sale products are available for a limited time only. Shop now before they&apos;re gone!</p></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {mockProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative pb-full"><img src={product.image} alt={product.name} className="w-full aspect-square object-cover hover:scale-105 transition-transform" /><div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-lg">-{product.discount}%</div><div className="absolute top-2 right-2"><button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow"><Heart className="w-5 h-5 text-gray-600" /></button></div></div>
              <div className="p-3"><p className="font-bold text-gray-900 line-clamp-2 text-sm mb-2">{product.name}</p><div className="flex items-center gap-2 mb-3"><span className="text-2xl font-bold text-red-600">฿{product.price.toFixed(2)}</span><span className="text-sm text-gray-500 line-through">฿{product.originalPrice.toFixed(2)}</span></div><p className="text-xs text-gray-600 mb-3"><span className="text-orange-600 font-bold">{Math.floor(product.sold)}</span> sold</p><Link href={`/product/${product.id}`} className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors text-center block">Shop Now</Link></div>
            </div>
          ))}
        </div>
        <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors">View More Flash Deals</button>
      </div>
    </div>
  )
}
