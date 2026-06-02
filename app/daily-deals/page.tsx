'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Sun, ShoppingCart, Heart } from 'lucide-react'

const CATEGORIES = ['الكل', 'إلكترونيات', 'أزياء', 'المنزل', 'جمال', 'رياضة']

const DEALS = [
  { id: 1, name: 'تلفزيون سامسونج 55 بوصة 4K', price: 1299, original: 2200, discount: 41, emoji: '📺' },
  { id: 2, name: 'آيفون 15 برو 256GB', price: 3499, original: 4500, discount: 22, emoji: '📱' },
  { id: 3, name: 'لابتوب ديل XPS 13', price: 2899, original: 4200, discount: 31, emoji: '💻' },
  { id: 4, name: 'مكيف سبليت 18000 BTU', price: 1599, original: 2500, discount: 36, emoji: '❄️' },
  { id: 5, name: 'غسالة LG 8 كيلو', price: 899, original: 1400, discount: 36, emoji: '🫧' },
  { id: 6, name: 'سماعة سوني WH-1000XM5', price: 899, original: 1500, discount: 40, emoji: '🎧' },
]

export default function DailyDealsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <Sun size={20} className="text-[#F57224]" />
        <h1 className="text-white font-bold text-lg">عروض اليوم</h1>
      </div>

      {/* Banner */}
      <div className="mx-4 mb-5 rounded-2xl p-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', border: '1px solid #F57224/20' }}>
        <div>
          <p className="text-[#F57224] font-black text-lg">عروض يومية 🔥</p>
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
          <button key={c} className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${i === 0 ? 'bg-[#F57224] text-white' : 'bg-[#1A1A1A] text-white/50'}`}>
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
                <div className="absolute top-2 right-2 bg-[#F57224] text-white text-xs font-black px-2 py-0.5 rounded-lg">-{p.discount}%</div>
                <button className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                  <Heart size={13} className="text-white" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-white text-xs font-semibold line-clamp-2 mb-2">{p.name}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[#F57224] font-black text-base">{p.price.toLocaleString()}</span>
                    <span className="text-[#F57224] text-xs"> AED</span>
                    <p className="text-white/30 text-xs line-through">{p.original.toLocaleString()} AED</p>
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
