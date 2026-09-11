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

export default function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const [title, setTitle] = useState('Products')
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [sortBy, setSortBy] = useState('trending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(({ handle }) => {
      const decodedTitle = decodeURIComponent(handle).replace(/-/g, ' ')
      setTitle(decodedTitle.charAt(0).toUpperCase() + decodedTitle.slice(1))
      setTimeout(() => setLoading(false), 300)
    })
  }, [params])

  const sortedProducts = [...products].sort((a, b) => sortBy === 'price-low' ? a.price - b.price : sortBy === 'price-high' ? b.price - a.price : b.sold - a.sold)

  return <main className="min-h-screen bg-gray-50"><header className="sticky top-0 z-40 bg-white border-b px-4 py-4"><div className="max-w-7xl mx-auto flex items-center justify-between"><h1 className="text-2xl font-bold">{title}</h1><select value={sortBy} onChange={event => setSortBy(event.target.value)} className="border rounded-lg p-2"><option value="trending">Trending</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select></div></header><div className="max-w-7xl mx-auto px-4 py-8">{loading ? <ProductGridSkeletonDark /> : <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{sortedProducts.map(product => <Link key={product.id} href={`/product/${product.handle}`} className="bg-white rounded-lg border overflow-hidden"><div className="aspect-square flex items-center justify-center text-4xl">{product.image}</div><div className="p-3"><h2 className="font-semibold text-sm line-clamp-2">{product.title}</h2><p className="text-pink-600 font-bold mt-2">AED {product.price}</p></div></Link>)}</div>}</div></main>
}
