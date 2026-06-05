'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'

interface RelatedProduct {
  id: string
  title: string
  handle: string
  price: string
  image: string
  rating?: number
  discount?: number
}

interface RelatedProductsProps {
  productHandle: string
}

export function RelatedProducts({ productHandle }: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/products/related?handle=${productHandle}`)
      .then(r => r.json())
      .then(d => {
        setProducts(d.products || getDefaultRelatedProducts())
        setLoading(false)
      })
      .catch(() => {
        setProducts(getDefaultRelatedProducts())
        setLoading(false)
      })
  }, [productHandle])

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        container.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [products])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const getDefaultRelatedProducts = (): RelatedProduct[] => [
    { id: '1', title: 'فستان ماكسي أنيق', handle: 'maxi-dress', price: '120 AED', image: '👗', rating: 4.8, discount: 35 },
    { id: '2', title: 'حزام جلدي فاخر', handle: 'leather-belt', price: '45 AED', image: '⌚', rating: 4.5, discount: 40 },
    { id: '3', title: 'حقيبة يد بنية', handle: 'brown-bag', price: '95 AED', image: '👜', rating: 4.9, discount: 38 },
    { id: '4', title: 'حذاء كاجوال', handle: 'casual-shoe', price: '85 AED', image: '👞', rating: 4.6, discount: 42 },
    { id: '5', title: 'سترة جينز زرقاء', handle: 'blue-jacket', price: '110 AED', image: '🧥', rating: 4.7, discount: 40 },
    { id: '6', title: 'شال فاخر', handle: 'luxury-shawl', price: '60 AED', image: '🧣', rating: 4.8, discount: 39 },
  ]

  if (loading) {
    return (
      <div className="py-6">
        <div className="h-4 bg-white/5 rounded w-32 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-40 flex-shrink-0 h-64 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="py-6 -mx-5 px-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-base">Related Products</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canScrollRight ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/30'
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canScrollLeft ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/30'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map(product => (
          <Link key={product.id} href={`/product/${product.handle}`}>
            <div className="w-40 flex-shrink-0 bg-[#1A1A1A] rounded-xl overflow-hidden hover:shadow-lg transition-shadow active:shadow-sm">
              {/* Image */}
              <div className="relative aspect-[4/5] bg-[#2A2A2A] flex items-center justify-center overflow-hidden">
                <div className="text-4xl">{product.image}</div>
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    -{product.discount}%
                  </div>
                )}
                <button className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-[#F57224]/15 flex items-center justify-center hover:bg-[#F57224]/25 transition-colors">
                  <Heart size={12} className="text-[#F57224]" />
                </button>
              </div>

              {/* Info */}
              <div className="p-2.5">
                <p className="text-white text-xs font-semibold line-clamp-2 mb-2 h-8">{product.title}</p>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[#F57224] text-sm font-bold">{product.price}</span>
                  {product.rating && (
                    <span className="text-[10px] text-white/60 flex items-center gap-0.5">
                      ⭐ {product.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
