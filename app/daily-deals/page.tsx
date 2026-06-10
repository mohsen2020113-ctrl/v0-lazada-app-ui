'use client'

import { Heart, Star, Gift } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const mockProducts = Array(12).fill(null).map((_, i) => ({ id: i + 1, name: `Daily Deal Product ${i + 1}`, price: 30 + Math.random() * 100, originalPrice: 100 + Math.random() * 200, discount: Math.floor(25 + Math.random() * 35), rating: 4.5 + Math.random() * 0.4, reviews: 100 + Math.random() * 9900, image: `https://via.placeholder.com/200x200?text=Product${i + 1}` }))

export default function DailyDealsPage() {
  const [selectedDay, setSelectedDay] = useState(0)
  const days = ['Today', 'Tomorrow', '+2 Days', '+3 Days', '+4 Days', '+5 Days']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4"><Gift className="w-8 h-8 text-pink-600" /><h1 className="text-3xl font-bold text-gray-900">Daily Deals</h1></div>
          <p className="text-gray-600 mb-6">New deals every day! Pick your favorites.</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((day, idx) => (
              <button key={idx} onClick={() => setSelectedDay(idx)} className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${selectedDay === idx ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>{day}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-gradient-to-r from-pink-600 to-red-600 rounded-lg p-8 mb-8 text-white"><h2 className="text-3xl font-bold mb-2">Today&apos;s Featured Deal</h2><p className="text-pink-100 mb-4">Limited quantity - First come, first served!</p><Link href="/product/1" className="inline-block px-8 py-3 bg-white text-pink-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">View Featured Product</Link></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {mockProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative"><img src={product.image} alt={product.name} className="w-full aspect-square object-cover hover:scale-105 transition-transform" /><div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded font-bold text-sm">-{product.discount}%</div><button className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"><Heart className="w-5 h-5 text-gray-600" /></button></div>
              <div className="p-3"><p className="font-bold text-gray-900 line-clamp-2 text-sm mb-2">{product.name}</p><div className="flex items-center gap-2 mb-2"><span className="text-lg font-bold text-pink-600">฿{product.price.toFixed(2)}</span><span className="text-sm text-gray-500 line-through">฿{product.originalPrice.toFixed(2)}</span></div><div className="flex items-center gap-1 text-xs mb-3"><div className="flex">{Array.from({ length: Math.floor(product.rating) }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</div><span className="text-gray-600">({product.reviews})</span></div><button className="w-full bg-pink-600 text-white py-2 rounded font-bold hover:bg-pink-700 transition-colors text-sm">View Deal</button></div>
            </Link>
          ))}
        </div>
        <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors">Load More Deals</button>
      </div>
    </div>
  )
}
