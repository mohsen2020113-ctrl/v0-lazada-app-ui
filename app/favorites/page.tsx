'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface FavItem { id: number; name: string; price: number; original: number; emoji: string }

export default function FavoritesPage() {
  const router = useRouter()
  const [items, setItems] = useState<FavItem[]>([
    { id: 1, name: 'سماعات سوني اللاسلكية', price: 599, original: 899, emoji: '🎧' },
    { id: 2, name: 'ساعة أبل Watch Series 9', price: 1399, original: 1799, emoji: '⌚' },
    { id: 3, name: 'آيباد Air M2', price: 2499, original: 2999, emoji: '📱' },
    { id: 4, name: 'كاميرا كانون EOS R50', price: 2199, original: 2800, emoji: '📷' },
  ])

  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">المفضلة</h1>
        {items.length > 0 && (
          <span className="mr-auto bg-[#F57224]/20 text-[#F57224] text-xs font-bold px-2.5 py-1 rounded-full">
            {items.length} منتج
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-24 h-24 rounded-full bg-[#F57224]/10 flex items-center justify-center mb-5">
            <Heart size={48} className="text-[#F57224]" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">قائمتك فارغة</h2>
          <p className="text-white/40 text-sm mb-7">أضف المنتجات التي تعجبك إلى المفضلة</p>
          <Link href="/" className="bg-[#F57224] text-white font-bold px-8 py-3.5 rounded-2xl">
            استكشف المنتجات
          </Link>
        </div>
      ) : (
        <div className="px-4 pb-24 space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-[#1A1A1A] rounded-2xl p-3 flex gap-3">
              <div className="w-20 h-20 rounded-xl bg-[#2A2A2A] flex items-center justify-center shrink-0">
                <span className="text-4xl">{item.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold line-clamp-2 mb-1">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[#F57224] font-black text-base">{item.price} AED</span>
                  <span className="text-white/30 text-xs line-through">{item.original} AED</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end justify-between shrink-0">
                <button onClick={() => remove(item.id)} className="text-white/20 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
                <button className="w-8 h-8 rounded-xl bg-[#F57224] flex items-center justify-center">
                  <ShoppingCart size={14} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
