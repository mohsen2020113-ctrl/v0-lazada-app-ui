'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, SlidersHorizontal, Heart } from 'lucide-react'
import { ProductGridSkeletonDark } from '@/components/skeleton-loader'
import { BottomSheetFilter } from '@/components/bottom-sheet-filter'
import { ProductFilterSheet, type FilterState } from '@/components/product-filter-sheet'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { InfiniteScrollLoaderDark } from '@/components/infinite-scroll-loader'

interface RawShopifyProduct {
  id: string
  title: string
  handle: string
  availableForSale?: boolean
  vendor?: string
  productType?: string
  tags?: string[]
  priceRange: { minVariantPrice: { amount: string } }
  compareAtPriceRange?: { minVariantPrice: { amount: string } } | null
  featuredImage?: { url: string } | null
  images?: { edges: { node: { url: string } }[] }
}

interface Product {
  id: string
  title: string
  handle: string
  price: number
  compareAtPrice: number | null
  image: string
  available: boolean
  vendor: string | null
  productType: string | null
  tags: string[]
}

function mapProduct(node: RawShopifyProduct): Product {
  const price = parseFloat(node.priceRange?.minVariantPrice?.amount || '0')
  const compareRaw = node.compareAtPriceRange?.minVariantPrice?.amount
  const compareAtPrice = compareRaw ? parseFloat(compareRaw) : null
  const image = node.featuredImage?.url || node.images?.edges?.[0]?.node?.url || ''
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    price,
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
    image,
    available: node.availableForSale ?? true,
    vendor: node.vendor || null,
    productType: node.productType || null,
    tags: node.tags || [],
  }
}

const SHIPPING_TAG_OPTIONS = [
  { value: 'free-shipping', label: 'توصيل مجاني' },
  { value: 'fast-delivery', label: 'توصيل سريع' },
  { value: 'express-shipping', label: 'شحن سريع' },
]

const FILTER_OPTIONS = [
  { label: 'الأكثر شيوعاً', value: 'trending' },
  { label: 'الأحدث', value: 'newest' },
  { label: 'السعر: من الأقل للأعلى', value: 'price-low' },
  { label: 'السعر: من الأعلى للأقل', value: 'price-high' },
  { label: 'الأعلى تقييماً', value: 'rating' },
]

const QUICK_FILTERS = [
  { label: 'الكل', value: 'trending' },
  { label: 'الأكثر مبيعاً', value: 'trending' },
  { label: 'الأعلى تقييماً', value: 'rating' },
  { label: 'السعر من الأقل للأعلى', value: 'price-low' },
]

const PRODUCTS_PER_PAGE = 8

function defaultFilterState(bounds: [number, number]): FilterState {
  return { subcategory: null, priceMin: bounds[0], priceMax: bounds[1], brands: [], shipping: [] }
}

function applyFilters(products: Product[], filters: FilterState): Product[] {
  return products.filter((p) => {
    if (filters.subcategory && p.productType !== filters.subcategory) return false
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false
    if (filters.brands.length > 0 && (!p.vendor || !filters.brands.includes(p.vendor))) return false
    if (filters.shipping.length > 0 && !filters.shipping.some((s) => p.tags.includes(s))) return false
    return true
  })
}

function sortProducts(products: Product[], sortBy: string): Product[] {
  const copy = [...products]
  switch (sortBy) {
    case 'newest':
      return copy.sort((a, b) => b.id.localeCompare(a.id))
    case 'price-low':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-high':
      return copy.sort((a, b) => b.price - a.price)
    default:
      return copy
  }
}

export default function CategoryPage({ params }: { params: { handle: string } }) {
  const router = useRouter()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [title, setTitle] = useState(decodeURIComponent(params.handle).replace(/-/g, ' '))
  const [activeFilter, setActiveFilter] = useState('trending')
  const [showSortSheet, setShowSortSheet] = useState(false)
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 1000])
  const [filters, setFilters] = useState<FilterState>(defaultFilterState([0, 1000]))
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products?collection=${params.handle}`)
      .then((r) => r.json())
      .then((data) => {
        const rawProducts: RawShopifyProduct[] = data.products || []
        const mapped = rawProducts.map(mapProduct)
        setAllProducts(mapped)
        if (mapped.length > 0) {
          const prices = mapped.map((p) => p.price)
          const bounds: [number, number] = [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
          setPriceBounds(bounds)
          setFilters(defaultFilterState(bounds))
        }
        if (data.title) setTitle(data.title)
        setLoading(false)
        setVisibleCount(PRODUCTS_PER_PAGE)
      })
      .catch(() => setLoading(false))
  }, [params.handle])

  const subcategories = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.productType).filter(Boolean))) as string[],
    [allProducts]
  )
  const brands = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.vendor).filter(Boolean))) as string[],
    [allProducts]
  )
  const shippingOptions = useMemo(
    () => SHIPPING_TAG_OPTIONS.filter((opt) => allProducts.some((p) => p.tags.includes(opt.value))),
    [allProducts]
  )

  const filteredProducts = useMemo(() => applyFilters(allProducts, filters), [allProducts, filters])
  const sortedProducts = useMemo(() => sortProducts(filteredProducts, activeFilter), [filteredProducts, activeFilter])

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE)
  }, [filters, activeFilter])

  const displayedProducts = sortedProducts.slice(0, visibleCount)
  const hasMore = visibleCount < sortedProducts.length

  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PRODUCTS_PER_PAGE, sortedProducts.length))
      setIsLoadingMore(false)
    }, 400)
  }, [isLoadingMore, hasMore, sortedProducts.length])

  const observerTarget = useInfiniteScroll({
    onLoadMore: loadMoreProducts,
    isLoading: isLoadingMore,
    hasMore,
  })

  const activeFilterCount =
    (filters.subcategory ? 1 : 0) +
    (filters.priceMin !== priceBounds[0] || filters.priceMax !== priceBounds[1] ? 1 : 0) +
    filters.brands.length +
    filters.shipping.length

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
      </div>

      {/* Quick filter chip bar */}
      <div className="px-3 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-white/5">
        {QUICK_FILTERS.map((qf, i) => (
          <button
            key={i}
            onClick={() => setActiveFilter(qf.value)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
              activeFilter === qf.value ? 'bg-[#C2185B] border-[#C2185B] text-white' : 'border-white/15 text-white/70'
            }`}
          >
            {qf.label}
          </button>
        ))}
        <button
          onClick={() => setShowFilterSheet(true)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-white/15 text-white/80"
        >
          <SlidersHorizontal size={13} />
          فلتر
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#C2185B] text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setShowSortSheet(true)}
          className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-white/15 text-white/80"
        >
          ترتيب
        </button>
      </div>

      {/* Products */}
      <div className="px-3 py-4 pb-24">
        {loading ? (
          <ProductGridSkeletonDark columns={2} />
        ) : displayedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-5xl text-white/10">📦</div>
            <p className="text-white/40 text-sm">لا توجد منتجات تطابق هذا الفلتر</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {displayedProducts.map((product) => (
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
                        <span className="text-[#C2185B] text-sm font-bold">{product.price} AED</span>
                        <button className="w-7 h-7 rounded-lg bg-[#C2185B]/15 flex items-center justify-center">
                          <Heart size={13} className="text-[#C2185B]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Infinite Scroll Observer */}
            <div ref={observerTarget} className="h-1 w-full" />

            {/* Loading Indicator */}
            <InfiniteScrollLoaderDark isLoading={isLoadingMore} />
          </>
        )}
      </div>

      {/* Sort Bottom Sheet */}
      <BottomSheetFilter
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        options={FILTER_OPTIONS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        title="ترتيب حسب"
      />

      {/* Advanced Filter Bottom Sheet */}
      <ProductFilterSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        subcategories={subcategories}
        brands={brands}
        shippingOptions={shippingOptions}
        priceBounds={priceBounds}
        value={filters}
        onApply={setFilters}
        computeCount={(state) => applyFilters(allProducts, state).length}
      />
    </div>
  )
}
