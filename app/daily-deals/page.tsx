'use client'

import { Heart, Star, Gift } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const mockProducts = Array(12).fill(null).map((_, i) => ({ id: i + 1, name: `Daily Deal Product ${i + 1}`, price: 30 + Math.random() * 100, originalPrice: 100 + Math.random() * 200, discount: Math.floor(25 + Math.random() * 35), rating: 4.5 + Math.random() * 0.4, reviews: 100 + Math.random() * 9900, image: `https://via.placeholder.com/200x200?text=Product${i + 1}` }))

export default function DailyDealsPage() {
  const [selectedDay, setSelectedDay] = useState(0)
  const days = ['Today', 'Tomorrow', '+2 Days', '+3 Days', '+4 Days', '+5 Days']

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <Sun size={20} className="text-[#C2185B]" />
        <h1 className="text-white font-bold text-lg">عروض اليوم</h1>
      </div>

      {/* Banner */}
      <div className="mx-4 mb-5 rounded-2xl p-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', border: '1px solid #C2185B/20' }}>
        <div>
          <p className="text-[#C2185B] font-black text-lg">عروض يومية 🔥</p>
          <p className="text-white/50 text-xs">تتجدد كل يوم الساعة 12 ظهراً</p>
        </div>
        <div className="text-right">
          <p className="text-white font-black text-2xl">-40%</p>
          <p className="text-white/30 text-xs">خصم يصل إلى</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 mb-5 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c, i) => (
          <button key={c} className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${i === 0 ? 'bg-[#C2185B] text-white' : 'bg-[#1A1A1A] text-white/50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {DEALS.map(p => (
            <div key={p.id} className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
              <div className="relative aspect-square bg-[#2A2A2A] flex items-center justify-center">
                <span className="text-5xl">{p.emoji}</span>
                <div className="absolute top-2 right-2 bg-[#C2185B] text-white text-xs font-black px-2 py-0.5 rounded-lg">-{p.discount}%</div>
                <button className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                  <Heart size={13} className="text-white" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-white text-xs font-semibold line-clamp-2 mb-2">{p.name}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[#C2185B] font-black text-base">{p.price.toLocaleString()}</span>
                    <span className="text-[#C2185B] text-xs"> AED</span>
                    <p className="text-white/30 text-xs line-through">{p.original.toLocaleString()} AED</p>
                  </div>
                  <button className="w-8 h-8 rounded-xl bg-[#C2185B] flex items-center justify-center">
                    <ShoppingCart size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
          ))}
        </div>
        <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors">Load More Deals</button>
      </div>
    </div>
  )
}
