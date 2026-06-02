'use client'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface WishlistItem {
  id: string
  title: string
  handle: string
  price: string
  image: string
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="bg-[#0F0F0F] px-4 py-4 border-b border-white/5">
        <h1 className="text-white font-bold text-lg">المفضلة</h1>
      </div>

      <div className="px-4 py-4 pb-24">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Heart size={56} className="text-white/10" />
            <p className="text-white/40 text-sm">قائمة المفضلة فارغة</p>
            <Link href="/" className="bg-[#F57224] text-white text-sm font-bold px-6 py-3 rounded-xl">
              استكشف المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map(item => (
              <div key={item.id} className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
                <Link href={`/product/${item.handle}`}>
                  <div className="relative aspect-[4/5] bg-[#2A2A2A]">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                    <button
                      onClick={(e) => { e.preventDefault(); setItems(prev => prev.filter(i => i.id !== item.id)) }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                    >
                      <Heart size={14} className="text-[#F57224] fill-[#F57224]" />
                    </button>
                  </div>
                </Link>
                <div className="p-2.5">
                  <p className="text-white text-xs font-semibold line-clamp-2 mb-2">{item.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F57224] text-sm font-bold">{item.price} AED</span>
                    <button className="w-7 h-7 rounded-lg bg-[#F57224]/15 flex items-center justify-center">
                      <ShoppingCart size={13} className="text-[#F57224]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
