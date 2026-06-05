'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Heart, ChevronLeft, SlidersHorizontal } from 'lucide-react'
import { ProductGridSkeleton } from '@/components/skeleton-loader'
import { BottomSheetFilter } from '@/components/bottom-sheet-filter'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { InfiniteScrollLoader } from '@/components/infinite-scroll-loader'

const TABS = ['الكل', 'نساء', 'رجال', 'أطفال', 'اكسسوارات']
const FILTER_OPTIONS = [
  { label: 'الأكثر مبيعاً', value: 'trending' },
  { label: 'الأحدث', value: 'newest' },
  { label: 'السعر: الأقل إلى الأعلى', value: 'price-low' },
  { label: 'السعر: الأعلى إلى الأقل', value: 'price-high' },
  { label: 'التقييم: الأفضل أولاً', value: 'rating' },
]

interface Product {
  id: string
  title: string
  handle: string
  price: number
  originalPrice?: number
  image: string
  discount?: number
  isNew?: boolean
  rating?: number
}

// Mock products data - expanded for infinite scroll
const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'فستان كاجوال مريح', handle: 'casual-dress', price: 89, originalPrice: 150, image: '👗', discount: 40, isNew: true, rating: 4.5 },
  { id: '2', title: 'قميص قطن فاخر', handle: 'cotton-shirt', price: 65, originalPrice: 120, image: '👔', discount: 45, rating: 4.8 },
  { id: '3', title: 'بنطلون جينز أصلي', handle: 'jeans', price: 120, originalPrice: 200, image: '👖', discount: 40, isNew: true, rating: 4.6 },
  { id: '4', title: 'معطف فخم شتوي', handle: 'winter-coat', price: 150, originalPrice: 280, image: '🧥', discount: 46, rating: 4.7 },
  { id: '5', title: 'تيشيرت رياضي', handle: 'sports-tee', price: 35, originalPrice: 60, image: '👕', discount: 42, isNew: true, rating: 4.4 },
  { id: '6', title: 'تنورة ماكسي أنيقة', handle: 'maxi-skirt', price: 95, originalPrice: 160, image: '👗', discount: 40, rating: 4.9 },
  { id: '7', title: 'حزام جلدي أسود', handle: 'leather-belt', price: 45, originalPrice: 75, image: '⌚', discount: 40, isNew: true, rating: 4.5 },
  { id: '8', title: 'حقيبة يد فاخرة', handle: 'handbag', price: 180, originalPrice: 300, image: '👜', discount: 40, rating: 5 },
  { id: '9', title: 'حذاء رياضي أبيض', handle: 'white-sneaker', price: 120, originalPrice: 200, image: '👟', discount: 40, rating: 4.7 },
  { id: '10', title: 'سترة جلدية سوداء', handle: 'leather-jacket', price: 250, originalPrice: 420, image: '🧥', discount: 40, isNew: true, rating: 4.9 },
  { id: '11', title: 'فستان سهرة فاخر', handle: 'evening-dress', price: 200, originalPrice: 350, image: '👗', discount: 43, rating: 4.8 },
  { id: '12', title: 'جاكيت ديم بلو', handle: 'denim-jacket', price: 110, originalPrice: 180, image: '🧥', discount: 39, rating: 4.6 },
  { id: '13', title: 'بنطلون خاكي', handle: 'khaki-pants', price: 75, originalPrice: 130, image: '👖', discount: 42, isNew: true, rating: 4.5 },
  { id: '14', title: 'تنورة ميدي', handle: 'midi-skirt', price: 85, originalPrice: 150, image: '👗', discount: 43, rating: 4.7 },
  { id: '15', title: 'بنطلون رياضي', handle: 'jogger-pants', price: 55, originalPrice: 100, image: '👖', discount: 45, rating: 4.4 },
  { id: '16', title: 'قميص برتقالي', handle: 'orange-shirt', price: 72, originalPrice: 130, image: '👔', discount: 45, rating: 4.6 },
]

const PRODUCTS_PER_PAGE = 8

export default function FashionPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [activeFilter, setActiveFilter] = useState('trending')
  const [allProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const observerTarget = useInfiniteScroll({
    onLoadMore: () => loadMoreProducts(),
    isLoading: isLoadingMore,
    hasMore,
  })

  useEffect(() => {
    setIsClient(true)
    // Initial load
    const timer = setTimeout(() => {
      const firstBatch = allProducts.slice(0, PRODUCTS_PER_PAGE)
      setDisplayedProducts(firstBatch)
      setHasMore(allProducts.length > PRODUCTS_PER_PAGE)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [allProducts])

  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    
    // Simulate network delay
    setTimeout(() => {
      const nextPage = page + 1
      const start = nextPage * PRODUCTS_PER_PAGE
      const end = start + PRODUCTS_PER_PAGE
      const newProducts = allProducts.slice(0, end)
      
      setDisplayedProducts(newProducts)
      setPage(nextPage)
      setHasMore(end < allProducts.length)
      setIsLoadingMore(false)
    }, 600)
  }, [page, allProducts, isLoadingMore, hasMore])

  const toggleFavorite = useCallback((productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }, [])

  const filteredProducts = [...displayedProducts].sort((a, b) => {
    switch (activeFilter) {
      case 'newest':
        return b.id.localeCompare(a.id)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default: // trending
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-4 gap-3">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center">الأزياء</h1>
          <button
            onClick={() => setShowFilterSheet(true)}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === i 
                  ? 'border-pink-600 text-pink-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Active Filter Display */}
      {activeFilter !== 'trending' && (
        <div className="px-4 py-2 bg-pink-50 border-b border-pink-100 flex items-center justify-between">
          <span className="text-xs font-medium text-pink-600">
            {FILTER_OPTIONS.find(f => f.value === activeFilter)?.label}
          </span>
          <button
            onClick={() => setActiveFilter('trending')}
            className="text-xs text-pink-600 hover:text-pink-700 font-medium"
          >
            إعادة تعيين
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="px-2 py-4 pb-24">
        {isLoading ? (
          <ProductGridSkeleton columns={2} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(product => (
                <Link key={product.id} href={`/product/${product.handle}`}>
                  <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow active:shadow-lg">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold">
                        {product.image}
                      </div>

                      {/* Discount Badge */}
                      {product.discount && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}

                      {/* New Badge */}
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                          جديد
                        </div>
                      )}

                      {/* Favorite Button */}
                      {isClient && (
                        <button
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Heart
                            size={16}
                            className={`transition-colors ${
                              favorites.has(product.id)
                                ? 'fill-pink-600 text-pink-600'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      )}

                      {/* Rating */}
                      {product.rating && (
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-gray-900 flex items-center gap-0.5">
                          ⭐ {product.rating}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-2.5">
                      {/* Title */}
                      <p className="text-gray-900 text-xs font-semibold line-clamp-2 mb-1.5 h-8">
                        {product.title}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-pink-600 font-bold text-sm">
                          {product.price.toLocaleString()} ر.س
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 text-xs line-through">
                            {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Infinite Scroll Observer */}
            <div ref={observerTarget} className="h-1 w-full" />
            
            {/* Loading Indicator */}
            <InfiniteScrollLoader isLoading={isLoadingMore} />
          </>
        )}
      </div>

      {/* Bottom Sheet Filter */}
      <BottomSheetFilter
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        options={FILTER_OPTIONS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        title="ترتيب حسب"
      />
    </div>
  )
}

