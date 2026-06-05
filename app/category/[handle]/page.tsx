'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, SlidersHorizontal, Heart } from 'lucide-react'
import { ProductGridSkeletonDark } from '@/components/skeleton-loader'

interface Product {
  id: string
  title: string
  handle: string
  price: string
  image: string
}

export default function CategoryPage({ params }: { params: { handle: string } }) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState(decodeURIComponent(params.handle).replace(/-/g, ' '))

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products?collection=${params.handle}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || [])
        if (data.title) setTitle(data.title)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.handle])

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="bg-[#0F0F0F] sticky top-0 z-10 border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center">
            <ArrowRight size={18} className="text-white" />
          </button>
          <h1 className="text-white font-bold text-lg capitalize">{title}</h1>
        </div>
        <button className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center">
          <SlidersHorizontal size={16} className="text-white" />
        </button>
      </div>

      {/* Products */}
      <div className="px-3 py-4 pb-24">
        {loading ? (
          <ProductGridSkeletonDark columns={2} />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-5xl text-white/10">📦</div>
            <p className="text-white/40 text-sm">لا توجد منتجات في هذا التصنيف</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => (
              <Link key={product.id} href={`/product/${product.handle}`}>
                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
                  <div className="relative aspect-[4/5] bg-[#2A2A2A]">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl">🛍️</div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-white text-xs font-semibold line-clamp-2 mb-2">{product.title}</p>
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
    </div>
  )
}
