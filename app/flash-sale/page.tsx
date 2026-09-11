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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <Zap size={20} className="text-[#C2185B] fill-[#C2185B]" />
        <h1 className="text-white font-bold text-lg">فلاش سيل</h1>
      </div>

      {/* Timer Banner */}
      <div className="mx-4 mb-5 rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #C2185B, #C13D00)' }}>
        <p className="text-white/80 text-xs mb-2 text-center">ينتهي العرض خلال</p>
        <div className="flex items-center justify-center gap-2">
          {[h, m, s].map((val, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-black/30 rounded-xl w-14 h-14 flex items-center justify-center">
                <span className="text-white font-black text-2xl">{val}</span>
              </div>
              {i < 2 && <span className="text-white font-black text-xl">:</span>}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-2">
          {['ساعة', 'دقيقة', 'ثانية'].map(l => <span key={l} className="text-white/50 text-xs">{l}</span>)}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map(p => (
            <div key={p.id} className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
              <div className="relative aspect-square bg-[#2A2A2A] flex items-center justify-center">
                <span className="text-5xl">📦</span>
                <div className="absolute top-2 right-2 bg-[#C2185B] text-white text-xs font-black px-2 py-0.5 rounded-lg">
                  -{p.discount}%
                </div>
                <button className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                  <Heart size={13} className="text-white" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-white text-xs font-semibold line-clamp-2 mb-1.5">{p.name}</p>
                {/* Progress bar */}
                <div className="h-1 bg-white/10 rounded-full mb-1.5">
                  <div className="h-1 bg-[#C2185B] rounded-full" style={{ width: p.sold + '%' }} />
                </div>
                <p className="text-white/30 text-xs mb-2">تم بيع {p.sold}%</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#C2185B] font-black text-base">{p.price}</span>
                    <span className="text-[#C2185B] text-xs"> AED</span>
                    <p className="text-white/30 text-xs line-through">{p.original} AED</p>
                  </div>
                  <button className="w-8 h-8 rounded-xl bg-[#C2185B] flex items-center justify-center">
                    <ShoppingCart size={14} className="text-white" />
                  </button>
                </div>
              </div>
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
            </div>
          ))}
        </div>
        <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors">View More Flash Deals</button>
      </div>
    </div>
  )
}
