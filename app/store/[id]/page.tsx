'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Star, MapPin, Phone, Share2, Heart, ShoppingCart } from 'lucide-react'

const PRODUCTS = [
  { id: 1, name: 'سماعات لاسلكية', price: 199, original: 350, rating: 4.5, emoji: '🎧' },
  { id: 2, name: 'ساعة ذكية', price: 450, original: 700, rating: 4.8, emoji: '⌚' },
  { id: 3, name: 'حافظة هاتف', price: 45, original: 80, rating: 4.3, emoji: '📱' },
  { id: 4, name: 'شاحن لاسلكي', price: 120, original: 200, rating: 4.6, emoji: '🔋' },
  { id: 5, name: 'كابل بيانات', price: 35, original: 60, rating: 4.2, emoji: '🔌' },
  { id: 6, name: 'حامل هاتف', price: 55, original: 90, rating: 4.4, emoji: '📲' },
]

export default function StorePage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white" dir="rtl">
      {/* Header */}
      <div className="bg-[#1A1A1A] px-4 py-4 flex items-center gap-3 border-b border-white/10">
        <button onClick={() => router.back()} className="text-white">
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-lg font-bold">صفحة الStore</h1>
        <div className="mr-auto flex gap-3">
          <button><Share2 className="w-5 h-5 text-gray-400" /></button>
          <button><Heart className="w-5 h-5 text-gray-400" /></button>
        </div>
      </div>

      {/* Store Banner */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-[#F57224]/20 flex items-center justify-center text-4xl">
            🏪
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Store التقنية العصرية</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">4.7</span>
              <span>(1.2K تقييم)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>دبي، الإمارات</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Product', value: '120+' },
            { label: 'مبيعات', value: '5K+' },
            { label: 'متابع', value: '890' },
          ].map(s => (
            <div key={s.label} className="bg-[#1A1A1A] rounded-xl p-3 text-center border border-white/5">
              <p className="text-[#F57224] font-bold text-lg">{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <button className="mt-4 w-full py-3 bg-[#1A1A1A] rounded-xl flex items-center justify-center gap-2 text-sm text-gray-300 border border-white/10">
          <Phone className="w-4 h-4 text-[#F57224]" />
          تواصل مع الStore
        </button>
      </div>

      {/* Products */}
      <div className="px-4 pb-6">
        <h3 className="text-base font-bold mb-3">Productات الStore</h3>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map(p => (
            <div key={p.id} className="bg-[#1A1A1A] rounded-2xl p-3 border border-white/5">
              <div className="w-full aspect-square bg-[#0F0F0F] rounded-xl flex items-center justify-center text-4xl mb-3">
                {p.emoji}
              </div>
              <p className="text-sm font-medium mb-1 leading-tight">{p.name}</p>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-400">{p.rating}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[#F57224] font-bold text-sm">{p.price}</span>
                <span className="text-gray-500 text-xs line-through">{p.original}</span>
                <span className="text-xs text-gray-400">د.إ</span>
              </div>
              <button className="w-full py-1.5 bg-[#F57224] rounded-lg flex items-center justify-center gap-1 text-xs font-semibold">
                <ShoppingCart className="w-3 h-3" />
                أضف
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
