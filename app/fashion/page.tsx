'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, TrendingUp, Sparkles, ArrowUp, ArrowDown, Heart } from 'lucide-react'

const TABS = ['الكل', 'نساء', 'رجال', 'أطفال', 'اكسسوارات']
const FILTERS = [
  { label: 'الأكثر مبيعاً', icon: TrendingUp },
  { label: 'الأحدث', icon: Sparkles },
  { label: 'السعر: الأقل', icon: ArrowUp },
  { label: 'السعر: الأعلى', icon: ArrowDown },
]

interface Product {
  id: string
  title: string
  handle: string
  price: string
  image: string
}

export default function FashionPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [activeFilter, setActiveFilter] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeTab])

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="bg-[#0F0F0F] sticky top-0 z-10 border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-white font-bold text-lg">الأزياء</h1>
          <button onClick={() => setShowFilter(true)} className="p-2 rounded-full bg-[#1A1A1A] text-white">
            <SlidersHorizontal size={18} />
          </button>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide px-4 gap-6 pb-0">
          {TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === i ? 'border-[#F57224] text-[#F57224]' : 'border-transparent text-white/50'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f, i) => {
          const Icon = f.icon
          return (
            <button key={i} onClick={() => setActiveFilter(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeFilter === i ? 'bg-[#F57224] text-white' : 'bg-[#1A1A1A] text-white/50'}`}>
              <Icon size={12} />{f.label}
            </button>
          )
        })}
      </div>
      <div className="px-3 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#F57224] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-white/40">لا توجد منتجات</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => (
              <Link key={product.id} href={`/product/${product.handle}`}>
                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
                  <div className="relative aspect-[3/4] bg-[#2A2A2A]">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">👗</div>
                    )}
                    <div className="absolute top-2 right-2 bg-[#F57224] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">جديد</div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-white text-xs font-semibold line-clamp-2 mb-1.5">{product.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#F57224] text-sm font-bold">{product.price} AED</span>
                      <button className="w-7 h-7 rounded-lg bg-[#F57224]/15 flex items-center justify-center">
                        <Heart size={13} className="text-[#F57224]" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-end" dir="rtl">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilter(false)} />
          <div className="relative w-full bg-[#1A1A1A] rounded-t-3xl p-6">
            <h2 className="text-white font-bold text-base mb-5">تصفية النتائج</h2>
            <p className="text-white/50 text-sm mb-3">السعر</p>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-[#0F0F0F] rounded-xl px-4 py-3 text-white text-sm">0 AED</div>
              <span className="text-white/40">—</span>
              <div className="flex-1 bg-[#0F0F0F] rounded-xl px-4 py-3 text-white text-sm">1000 AED</div>
            </div>
            <button onClick={() => setShowFilter(false)} className="w-full bg-[#F57224] text-white font-bold py-3 rounded-xl">تطبيق</button>
          </div>
        </div>
      )}
    </div>
  )
      }
