'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, TrendingUp, SearchX } from 'lucide-react'
import Link from 'next/link'

const POPULAR = ['فستان', 'حذاء', 'حقيبة', 'ساعة', 'عطر', 'نظارة']

type Product = {
  id: string
  title: string
  handle: string
  price: string
  image: string
}

async function searchProducts(q: string): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.products || []
  } catch {
    return []
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (q: string) => {
    if (!q.trim()) return
    setQuery(q)
    setLoading(true)
    setSearched(true)
    const products = await searchProducts(q)
    setResults(products)
    setLoading(false)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setSearched(false)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Search bar */}
      <div className="bg-[#0F0F0F] px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-[#1A1A1A] rounded-xl flex items-center px-3 h-11 gap-2">
          <Search size={18} className="text-white/30 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            placeholder="ابحث عن منتجات..."
            autoFocus
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
            dir="rtl"
          />
          {query && (
            <button onClick={clearSearch} className="text-white/30">
              <X size={16} />
            </button>
          )}
        </div>
        <Link href="/" className="text-white/50 text-sm font-medium whitespace-nowrap">إلغاء</Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#F57224] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !searched ? (
        <div className="px-4 pt-4">
          <p className="text-white/40 text-xs font-bold tracking-wider mb-3">عمليات البحث الشائعة</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map(term => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="flex items-center gap-1.5 bg-[#1A1A1A] border border-white/8 rounded-full px-4 py-2"
              >
                <TrendingUp size={13} className="text-[#F57224]" />
                <span className="text-white/70 text-sm">{term}</span>
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(245,114,36,0.1)' }}>
            <SearchX size={40} className="text-[#F57224]" />
          </div>
          <h2 className="text-white text-lg font-bold mb-2">لا توجد نتائج</h2>
          <p className="text-white/40 text-sm">جرّب البحث بكلمة مختلفة</p>
        </div>
      ) : (
        <div>
          <p className="text-white/40 text-xs px-4 py-3">{results.length} نتيجة</p>
          <div className="grid grid-cols-2 gap-3 px-3 pb-6">
            {results.map(product => (
              <Link key={product.id} href={`/product/${product.handle}`} className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full aspect-square object-cover bg-[#2A2A2A]"
                />
                <div className="p-2.5">
                  <p className="text-white text-xs font-semibold line-clamp-2 mb-1">{product.title}</p>
                  <p className="text-[#F57224] text-sm font-bold">{product.price} AED</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
          }
