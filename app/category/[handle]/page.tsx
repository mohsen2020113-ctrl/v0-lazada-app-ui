'use client'
<<<<<<< HEAD

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, Heart, Search, Filter, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
=======
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, SlidersHorizontal, Heart } from 'lucide-react'
import { ProductGridSkeletonDark } from '@/components/skeleton-loader'
import { BottomSheetFilter } from '@/components/bottom-sheet-filter'
import { ProductFilterSheet, type FilterState } from '@/components/product-filter-sheet'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { InfiniteScrollLoaderDark } from '@/components/infinite-scroll-loader'
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2

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
<<<<<<< HEAD
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  sold: number
  discount?: number
}

const SORT_OPTIONS = [
  { label: 'Trending', value: 'trending' },
  { label: 'Newest', value: 'newest' },
  { label: 'Best Rating', value: 'rating' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Premium Wireless Headphones with Noise Cancellation',
    handle: 'wireless-headphones',
    price: 299,
    originalPrice: 399,
    image: '🎧',
    rating: 4.8,
    reviews: 256,
    sold: 1204,
    discount: 25,
  },
  {
    id: 'prod-2',
    title: 'Ultra Fast USB 3.0 Flash Drive 256GB',
    handle: 'usb-flash-drive',
    price: 89,
    originalPrice: 129,
    image: '💾',
    rating: 4.6,
    reviews: 189,
    sold: 892,
    discount: 31,
  },
  {
    id: 'prod-3',
    title: 'Portable Phone Charger 20000mAh',
    handle: 'phone-charger',
    price: 145,
    originalPrice: 199,
    image: '🔋',
    rating: 4.9,
    reviews: 412,
    sold: 2341,
    discount: 27,
  },
  {
    id: 'prod-4',
    title: 'Ergonomic Wireless Mouse USB Receiver',
    handle: 'wireless-mouse',
    price: 64,
    originalPrice: 99,
    image: '🖱️',
    rating: 4.5,
    reviews: 157,
    sold: 645,
    discount: 35,
  },
  {
    id: 'prod-5',
    title: 'Premium Phone Screen Protector Tempered Glass',
    handle: 'screen-protector',
    price: 24,
    originalPrice: 49,
    image: '📱',
    rating: 4.7,
    reviews: 523,
    sold: 3421,
    discount: 51,
  },
  {
    id: 'prod-6',
    title: 'Bluetooth Speaker Waterproof with AUX',
    handle: 'bluetooth-speaker',
    price: 178,
    originalPrice: 259,
    image: '🔊',
    rating: 4.8,
    reviews: 334,
    sold: 1876,
    discount: 31,
  },
  {
    id: 'prod-7',
    title: 'USB-C Fast Charging Cable 3 Pack',
    handle: 'usb-c-cable',
    price: 34,
    originalPrice: 59,
    image: '🔌',
    rating: 4.6,
    reviews: 267,
    sold: 2154,
    discount: 42,
  },
  {
    id: 'prod-8',
    title: 'Phone Stand Desktop Adjustable Holder',
    handle: 'phone-stand',
    price: 42,
    originalPrice: 79,
    image: '📐',
    rating: 4.4,
    reviews: 198,
    sold: 876,
    discount: 47,
  },
  {
    id: 'prod-9',
    title: 'Wireless Charging Pad 15W Fast Charge',
    handle: 'charging-pad',
    price: 89,
    originalPrice: 139,
    image: '⚡',
    rating: 4.7,
    reviews: 412,
    sold: 1234,
    discount: 36,
  },
  {
    id: 'prod-10',
    title: 'HDMI Cable 4K 2m High Speed Gold Plated',
    handle: 'hdmi-cable',
    price: 52,
    originalPrice: 89,
    image: '📺',
    rating: 4.5,
    reviews: 145,
    sold: 567,
    discount: 42,
  },
]
=======
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
const AUTO_LOAD_THRESHOLD = 40

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
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2

export default function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const router = useRouter()
<<<<<<< HEAD
  const [handle, setHandle] = useState<string>('')
  const [title, setTitle] = useState('Products')
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [sortBy, setSortBy] = useState('trending')
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then((p) => {
      setHandle(p.handle)
      const decodedTitle = decodeURIComponent(p.handle).replace(/-/g, ' ')
      setTitle(decodedTitle.charAt(0).toUpperCase() + decodedTitle.slice(1))
      
      // Simulate API call
      setTimeout(() => {
        setProducts(MOCK_PRODUCTS)
        setLoading(false)
      }, 600)
    })
  }, [params])

  const sortedProducts = useCallback(() => {
    const sorted = [...products]
    switch (sortBy) {
      case 'newest':
        return sorted.reverse()
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'trending':
      default:
        return sorted.sort((a, b) => b.sold - a.sold)
    }
  }, [products, sortBy])()

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600 font-medium">{rating.toFixed(1)}</span>
    </div>
  )
=======
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

  const isAutoLoadActive = visibleCount < AUTO_LOAD_THRESHOLD

  const observerTarget = useInfiniteScroll({
    onLoadMore: loadMoreProducts,
    isLoading: isLoadingMore,
    hasMore: hasMore && isAutoLoadActive,
  })

  const activeFilterCount =
    (filters.subcategory ? 1 : 0) +
    (filters.priceMin !== priceBounds[0] || filters.priceMax !== priceBounds[1] ? 1 : 0) +
    filters.brands.length +
    filters.shipping.length
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-base font-bold text-gray-900 flex-1 truncate">{title}</h1>
          <button
            onClick={() => router.push('/search')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Sort and Filter Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 overflow-x-auto">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap text-sm font-medium text-gray-900"
            >
              <span>Sort</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Sort Dropdown Menu */}
            {showSortMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-48">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setShowSortMenu(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                      sortBy === option.value ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap text-sm font-medium text-gray-900">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
<<<<<<< HEAD
=======
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
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
      </div>

      {/* Products Grid */}
      <div className="px-2 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-[2.5/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
<<<<<<< HEAD
            <div className="text-5xl">📦</div>
            <p className="text-gray-600 text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {sortedProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.handle}`}>
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative aspect-[2.5/3] bg-gray-50 overflow-hidden flex items-center justify-center">
                      <span className="text-4xl">{product.image}</span>

                      {/* Discount Badge */}
                      {product.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
=======
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
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleWishlist(product.id)
                        }}
                        className="absolute top-2 left-2 p-2 bg-white/90 hover:bg-white rounded-lg transition-all transform hover:scale-110"
                      >
                        <Heart
                          size={16}
                          className={`transition-colors ${
                            wishlist.has(product.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>
<<<<<<< HEAD

                    {/* Product Info */}
                    <div className="p-2.5 flex-1 flex flex-col">
                      <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2 flex-1">
                        {product.title}
                      </h3>

                      {/* Rating */}
                      <div className="mb-2">
                        <StarRating rating={product.rating} />
                      </div>

                      {/* Sold Info */}
                      <p className="text-xs text-gray-500 mb-2">
                        {product.sold.toLocaleString()} sold
                      </p>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-pink-600">
                          AED {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            AED {product.originalPrice}
                          </span>
                        )}
=======
                    <div className="p-2.5">
                      <p className="text-white text-xs font-semibold line-clamp-2 mb-2">{product.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#C2185B] text-sm font-bold">{product.price} AED</span>
                        <button className="w-7 h-7 rounded-lg bg-[#C2185B]/15 flex items-center justify-center">
                          <Heart size={13} className="text-[#C2185B]" />
                        </button>
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
                      </div>
                    </div>
                  </div>
                </Link>
<<<<<<< HEAD
              </div>
            ))}
          </div>
        )}
      </div>
=======
              ))}
            </div>

            {/* Infinite Scroll Observer (active until AUTO_LOAD_THRESHOLD products) */}
            {isAutoLoadActive && <div ref={observerTarget} className="h-1 w-full" />}

            {/* Loading Indicator */}
            <InfiniteScrollLoaderDark isLoading={isLoadingMore} />

            {/* Manual Load More button after the auto-load threshold */}
            {!isAutoLoadActive && hasMore && !isLoadingMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreProducts}
                  className="px-6 py-2.5 rounded-full bg-[#1A1A1A] border border-white/15 text-white text-sm font-medium hover:bg-[#2A2A2A] transition-colors"
                >
                  تحميل المزيد
                </button>
              </div>
            )}
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
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
    </div>
  )
}

