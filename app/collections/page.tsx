'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Grid3X3, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const COLLECTIONS = [
  { handle: 'electronics', name: 'الإلكترونيات', emoji: '📱', count: 240, color: '#3B82F6' },
  { handle: 'fashion', name: 'الأزياء والموضة', emoji: '👗', count: 180, color: '#EC4899' },
  { handle: 'home', name: 'المنزل والمطبخ', emoji: '🏠', count: 150, color: '#10B981' },
  { handle: 'beauty', name: 'الجمال والعناية', emoji: '💄', count: 120, color: '#8B5CF6' },
  { handle: 'sports', name: 'الرياضة واللياقة', emoji: '⚽', count: 90, color: '#F59E0B' },
  { handle: 'gaming', name: 'الألعاب والترفيه', emoji: '🎮', count: 75, color: '#EF4444' },
  { handle: 'food', name: 'الغذاء والمشروبات', emoji: '🍔', count: 60, color: '#F97316' },
  { handle: 'kids', name: 'الأطفال والألعاب', emoji: '🧸', count: 110, color: '#06B6D4' },
  { handle: 'books', name: 'الكتب والقرطاسية', emoji: '📚', count: 85, color: '#84CC16' },
  { handle: 'automotive', name: 'السيارات والقطع', emoji: '🚗', count: 45, color: '#6366F1' },
  { handle: 'travel', name: 'السفر والحقائب', emoji: '✈️', count: 55, color: '#14B8A6' },
  { handle: 'watches', name: 'الساعات والمجوهرات', emoji: '⌚', count: 70, color: '#F59E0B' },
]

export default function CollectionsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <Grid3X3 size={20} className="text-[#F57224]" />
        <h1 className="text-white font-bold text-lg">جميع الأقسام</h1>
      </div>

      <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {COLLECTIONS.map(col => (
            <Link key={col.handle} href={`/category/${col.handle}`}
              className="bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 hover:bg-[#222]">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                style={{ background: col.color + '20' }}>
                {col.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold line-clamp-1">{col.name}</p>
                <p className="text-white/30 text-xs">{col.count} منتج</p>
              </div>
              <ChevronLeft size={16} className="text-white/20 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
