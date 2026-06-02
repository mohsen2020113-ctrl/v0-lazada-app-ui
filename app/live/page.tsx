'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Radio, Eye, Heart, ShoppingCart, Share2 } from 'lucide-react'

const STREAMS = [
  { id: 1, host: 'متجر التقنية', viewers: 1240, title: 'عرض حصري: أحدث الهواتف 2026', emoji: '📱', live: true },
  { id: 2, host: 'فاشون ستوري', viewers: 890, title: 'كولكشن صيف 2026 🔥', emoji: '👗', live: true },
  { id: 3, host: 'هوم ديكور', viewers: 456, title: 'أثاث وديكور بأقل الأسعار', emoji: '🏠', live: true },
  { id: 4, host: 'ماكياج برو', viewers: 2100, title: 'تطبيق مكياج مباشر + هدايا', emoji: '💄', live: true },
  { id: 5, host: 'جيمر زون', viewers: 320, title: 'أحدث الألعاب والأجهزة', emoji: '🎮', live: false },
  { id: 6, host: 'سبورت لايف', viewers: 670, title: 'معدات رياضية + تمارين مباشرة', emoji: '⚽', live: false },
]

export default function LivePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <Radio size={20} className="text-red-500" />
        <h1 className="text-white font-bold text-lg">البث المباشر</h1>
        <div className="mr-auto flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          مباشر الآن
        </div>
      </div>

      {/* Featured Live */}
      <div className="mx-4 mb-5 rounded-2xl overflow-hidden bg-[#1A1A1A]">
        <div className="relative h-48 bg-gradient-to-br from-[#F57224]/20 to-[#1A1A1A] flex items-center justify-center">
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
          <button className="flex-1 bg-[#F57224] text-white py-2.5 rounded-xl text-sm font-bold">مشاهدة</button>
          <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Heart size={16} className="text-white" /></button>
          <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Share2 size={16} className="text-white" /></button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 pb-24">
        <p className="text-white/40 text-xs font-bold tracking-wider mb-3">جميع البثوث</p>
        <div className="grid grid-cols-2 gap-3">
          {STREAMS.slice(0, 5).map(s => (
            <div key={s.id} className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
              <div className="relative aspect-video bg-[#2A2A2A] flex items-center justify-center">
                <span className="text-4xl">{s.emoji}</span>
                {s.live && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />LIVE
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-0.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
                  <Eye size={10} /> {s.viewers}
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-white text-xs font-semibold line-clamp-1">{s.title}</p>
                <p className="text-white/40 text-xs">{s.host}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
      }
