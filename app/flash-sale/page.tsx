'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Zap, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'

const PRODUCTS = [
  { id: 1, name: 'سماعات لاسلكية احترافية', price: 299, original: 599, img: '', discount: 50, sold: 78 },
  { id: 2, name: 'ساعة ذكية رياضية', price: 199, original: 399, img: '', discount: 50, sold: 45 },
  { id: 3, name: 'كاميرا مراقبة ذكية', price: 149, original: 320, img: '', discount: 53, sold: 92 },
  { id: 4, name: 'مكبر صوت بلوتوث', price: 89, original: 180, img: '', discount: 51, sold: 30 },
  { id: 5, name: 'شاحن لاسلكي سريع', price: 49, original: 100, img: '', discount: 51, sold: 60 },
  { id: 6, name: 'حافظة هاتف مع بطارية', price: 79, original: 150, img: '', discount: 47, sold: 22 },
]

function useCountdown(targetSeconds: number) {
  const [secs, setSecs] = useState(targetSeconds)
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return [h, m, s].map(n => String(n).padStart(2, '0'))
}

export default function FlashSalePage() {
  const router = useRouter()
  const [h, m, s] = useCountdown(6 * 3600 + 24 * 60 + 11)

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <Zap size={20} className="text-[#F57224] fill-[#F57224]" />
        <h1 className="text-white font-bold text-lg">فلاش سيل</h1>
      </div>

      {/* Timer Banner */}
      <div className="mx-4 mb-5 rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #F57224, #C13D00)' }}>
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
                <div className="absolute top-2 right-2 bg-[#F57224] text-white text-xs font-black px-2 py-0.5 rounded-lg">
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
                  <div className="h-1 bg-[#F57224] rounded-full" style={{ widur: p.sold + '%' }} />
                </div>
                <p className="text-white/30 text-xs mb-2">تم بيع {p.sold}%</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#F57224] font-black text-base">{p.price}</span>
                    <span className="text-[#F57224] text-xs"> AED</span>
                    <p className="text-white/30 text-xs line-through">{p.original} AED</p>
                  </div>
                  <button className="w-8 h-8 rounded-xl bg-[#F57224] flex items-center justify-center">
                    <ShoppingCart size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
          }
