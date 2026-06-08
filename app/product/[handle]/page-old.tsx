'use client'

import { useEffect, useRef, useState, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Search,
  Share2,
  ShoppingCart,
  Heart,
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  Store,
  MessageCircle,
  ImageIcon,
  Languages,
} from 'lucide-react'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductReviews } from '@/components/product/product-reviews'
import { SellerSimilar } from '@/components/product/seller-similar'

interface Product {
  id: string
  name: string
  nameEn: string
  price: number
  originalPrice: number
  discount: number
  images: string[]
  rating: number
  reviews: number
  sold: number
  stock: number
  colors: string[]
  sizes: string[]
  description: string
  specifications: Record<string, string>
  seller: { name: string; rating: number; totalSales: number }
  shipping: { free: boolean; days: number; from: string }
  tags: string[]
}

// Default product for safe fallback rendering
const DEFAULT_PRODUCT: Product = {
  id: '',
  name: 'Product',
  nameEn: 'Product',
  price: 0,
  originalPrice: 0,
  discount: 0,
  images: [],
  rating: 0,
  reviews: 0,
  sold: 0,
  stock: 0,
  colors: [],
  sizes: [],
  description: '',
  specifications: {},
  seller: { name: 'Unknown Seller', rating: 0, totalSales: 0 },
  shipping: { free: false, days: 0, from: 'UAE' },
  tags: [],
}

interface ErrorState {
  message: string
  messageAr: string
  type: 'network' | 'timeout' | 'server' | 'unauthorized' | 'unknown'
}

const TABS = ['Overview', 'Reviews', 'Product Details', 'Recommendations'] as const
type Tab = (typeof TABS)[number]

// Helper to safely access product data with defaults
function getSafeProduct(product: Product | null): Product {
  if (!product) return DEFAULT_PRODUCT

  return {
    id: product.id ?? '',
    name: product.name ?? 'Product',
    nameEn: product.nameEn ?? product.name ?? 'Product',
    price: product.price ?? 0,
    originalPrice: product.originalPrice ?? product.price ?? 0,
    discount: product.discount ?? 0,
    images: Array.isArray(product.images) ? product.images : [],
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
    sold: product.sold ?? 0,
    stock: product.stock ?? 0,
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    description: product.description ?? '',
    specifications: product.specifications ?? {},
    seller: product.seller ?? { name: 'Unknown Seller', rating: 0, totalSales: 0 },
    shipping: product.shipping ?? { free: false, days: 0, from: 'UAE' },
    tags: Array.isArray(product.tags) ? product.tags : [],
  }
}

// Helper function to categorize errors and provide bilingual messages
function categorizeError(err: unknown): ErrorState {
  if (err instanceof TypeError) {
    // Network error or CORS issue
    if (err.message.includes('fetch')) {
      return {
        type: 'network',
        message: 'Unable to connect to the server. Please check your internet connection.',
        messageAr: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت لديك.',
      }
    }
    // JSON parsing error
    return {
      type: 'unknown',
      message: 'Failed to load product data. Please try again.',
      messageAr: 'فشل تحميل بيانات المنتج. يرجى المحاولة مرة أخرى.',
    }
  }

  if (err instanceof Error) {
    const msg = err.message

    // Timeout
    if (msg.includes('timeout') || msg.includes('aborted')) {
      return {
        type: 'timeout',
        message: 'The request took too long. Please try again.',
        messageAr: 'استغرقت الطلب وقتاً طويلاً. يرجى المحاولة مرة أخرى.',
      }
    }

    // Server errors
    if (msg.includes('500') || msg.includes('502') || msg.includes('503')) {
      return {
        type: 'server',
        message: 'The server is temporarily unavailable. Please try again later.',
        messageAr: 'الخادم غير متاح مؤقتاً. يرجى المحاولة لاحقاً.',
      }
    }

    // Unauthorized
    if (msg.includes('401') || msg.includes('403')) {
      return {
        type: 'unauthorized',
        message: 'You do not have permission to view this product.',
        messageAr: 'ليس لديك إذن لعرض هذا المنتج.',
      }
    }

    // Generic HTTP errors
    if (msg.includes('HTTP')) {
      return {
        type: 'server',
        message: 'Failed to load the product. Please try again.',
        messageAr: 'فشل تحميل المنتج. يرجى المحاولة مرة أخرى.',
      }
    }
  }

  // Unknown error
  return {
    type: 'unknown',
    message: 'Something went wrong. Please try again.',
    messageAr: 'حدث شيء ما خطأ. يرجى المحاولة مرة أخرى.',
  }
}

export default function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorState | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [selectedColor, setSelectedColor] = useState(0)
  const [wished, setWished] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const sectionRefs = {
    Overview: useRef<HTMLDivElement>(null),
    Reviews: useRef<HTMLDivElement>(null),
    'Product Details': useRef<HTMLDivElement>(null),
    Recommendations: useRef<HTMLDivElement>(null),
  }

  const handleGoBack = useCallback(() => {
    if (isClient) {
      router.back()
    }
  }, [router, isClient])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!handle) return

    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    fetch(`/api/products/${handle}`, { signal: controller.signal })
      .then((r) => {
        if (r.status === 404) {
          notFound()
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d) => {
        if (!d) notFound()
        setProduct(d)
      })
      .catch((err) => {
        console.error('[v0] Product fetch error:', err)
        setProduct(null)

        // Don't set error for aborted requests (likely due to navigation)
        if (err.name !== 'AbortError') {
          setError(categorizeError(err))
        }
      })
      .finally(() => {
        clearTimeout(timeoutId)
        setLoading(false)
      })

    return () => controller.abort()
  }, [handle])

  const scrollToSection = (tab: Tab) => {
    setActiveTab(tab)
    sectionRefs[tab].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 py-8">
        <div className="text-center max-w-md">
          {/* Error icon based on type */}
          <div className="mb-6 flex justify-center">
            {error?.type === 'network' && (
              <div className="rounded-full bg-red-100 p-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16H5m13 0h-3m0 0a8 8 0 11-16 0 8 8 0 0116 0zM9 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
            {error?.type === 'timeout' && (
              <div className="rounded-full bg-yellow-100 p-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {error?.type === 'server' && (
              <div className="rounded-full bg-orange-100 p-4">
                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {(!error?.type || error?.type === 'unknown') && (
              <div className="rounded-full bg-gray-100 p-4">
                <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* Error message */}
          <h2 className="text-2xl font-bold text-foreground mb-2">حدث خطأ ما</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {error?.messageAr || 'فشل تحميل المنتج. يرجى المحاولة مرة أخرى.'}
          </p>

          {/* English message */}
          <p className="text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
            {error?.message || 'Failed to load the product. Please try again.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row">
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-primary px-8 py-2.5 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            إعادة محاولة
          </button>
          <button
            onClick={handleGoBack}
            className="rounded border-2 border-primary px-8 py-2.5 text-primary font-semibold hover:bg-primary/5 transition-colors"
          >
            العودة للخلف
          </button>
        </div>

        {/* Troubleshooting tips */}
        {error?.type === 'network' && (
          <div className="mt-6 text-left text-sm text-muted-foreground max-w-md bg-blue-50 border border-blue-200 rounded p-4">
            <p className="font-semibold text-blue-900 mb-2">تلميحات التحكم بالمشاكل:</p>
            <ul className="space-y-1 text-xs">
              <li>• تحقق من اتصال الإنترنت لديك</li>
              <li>• أغلق وأعد فتح التطبيق</li>
              <li>• جرب من خلال شبكة مختلفة</li>
            </ul>
          </div>
        )}
      </div>
    )
  }

  // Use safe product access to prevent crashes with missing data
  const safeProduct = getSafeProduct(product)
  const title = safeProduct.nameEn || safeProduct.name || 'Product'

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
        <div className="flex items-center gap-2 px-3 py-3">
          <button onClick={handleGoBack} aria-label="Back" className="p-1">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-lg border-2 border-primary px-4 py-2.5">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search in 4LEEE"
              className="flex-1 bg-transparent text-sm placeholder-muted-foreground outline-none"
            />
          </div>
          <button aria-label="Refresh" className="p-1">
            <Share2 className="h-6 w-6 text-foreground" />
          </button>
          <button aria-label="Cart" className="relative p-1">
            <ShoppingCart className="h-6 w-6 text-foreground" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              3
            </span>
          </button>
          <button aria-label="More" className="p-1">
            <span className="text-lg">⋯</span>
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-4 overflow-x-auto border-t border-border px-4 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => scrollToSection(tab)}
              className={`relative whitespace-nowrap py-3 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-sm" />
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Overview anchor */}
      <div ref={sectionRefs.Overview}>
        <ProductGallery images={safeProduct.images} alt={title} discount={safeProduct.discount} />

        {/* Variant thumbnails carousel */}
        <div className="flex gap-2 overflow-x-auto bg-white px-4 py-3 scrollbar-hide">
          {safeProduct.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedColor(i)}
              className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 ${selectedColor === i ? 'border-primary' : 'border-transparent'
                }`}
            >
              <img
                src={src || '/placeholder.svg'}
                alt={`Variant ${i + 1}`}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </button>
          ))}
        </div>

        {/* Price block */}
        <div className="bg-white px-4 pb-3">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-primary">AED {safeProduct.price.toFixed(2)}</span>
            <span className="mb-1 text-base text-muted-foreground line-through">
              AED {safeProduct.originalPrice.toFixed(2)}
            </span>
            <span className="mb-1 rounded bg-[#FFE9F2] px-1.5 py-0.5 text-sm font-bold text-primary">
              -{safeProduct.discount}%
            </span>
          </div>

          {/* Promo chips */}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded bg-[#FFF0F5] px-2 py-1 text-xs font-semibold text-primary">
              Buy AED 1500, extra 5% OFF
            </span>
            <span className="rounded bg-[#FFF0F5] px-2 py-1 text-xs font-semibold text-primary">
              TrueMoney | Extra AED 10 Off
            </span>
          </div>
        </div>

        {/* Campaign voucher */}
        <div className="bg-white px-4 pb-3">
          <div className="flex items-center justify-between rounded-xl border border-dashed border-primary/40 p-3">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 fill-primary text-primary" />
              <div>
                <p className="text-lg font-bold text-primary">14% OFF</p>
                <p className="text-xs text-muted-foreground">Min. spend AED 599, Cap AED 300</p>
              </div>
            </div>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              Collect
            </button>
          </div>
        </div>

        {/* Title + translate */}
        <div className="bg-white px-4 pb-3">
          <div className="flex items-start gap-2">
            <h1 className="flex-1 text-lg font-bold leading-snug text-foreground text-pretty">{title}</h1>
            <button aria-label="Translate" className="mt-1 rounded border border-border p-1.5">
              <Languages className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Best sellers banner */}
          <div className="mt-3 flex items-center justify-between rounded-lg bg-gradient-to-r from-[#FFEFD9] to-[#FFF8EF] px-3 py-2">
            <span className="text-sm font-bold text-[#A05A2C]">
              Best Sellers <span className="font-semibold">TOP 18 in this category</span>
            </span>
            <ChevronRight className="h-4 w-4 text-[#A05A2C]" />
          </div>

          {/* Feature tags */}
          {safeProduct.tags.length > 0 && (
            <p className="mt-2 text-sm font-semibold text-[#A05A2C]">
              {safeProduct.tags.slice(0, 2).join('  |  ')}
            </p>
          )}

          {/* Rating row */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-[#FFB400] text-[#FFB400]" />
              <span className="font-bold text-foreground">{safeProduct.rating}</span>
              <span className="text-muted-foreground">({safeProduct.reviews})</span>
              <span className="text-border">|</span>
              <span className="text-muted-foreground">{safeProduct.sold.toLocaleString()} sold</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setWished(!wished)} aria-label="Wishlist">
                <Heart className={`h-5 w-5 ${wished ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              </button>
              <button aria-label="Share">
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-2 bg-muted" />

        {/* Free return row */}
        <div className="bg-white">
          <button className="flex w-full items-center gap-3 px-4 py-3.5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#5B6CFF]" />
            <span className="flex-1 text-left text-base text-foreground">Change of Mind · 7 Days Free Return</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Delivery row */}
          <button className="flex w-full items-start gap-3 border-t border-border px-4 py-3.5">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#5B6CFF]" />
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-foreground">
                  Guaranteed by {safeProduct.shipping?.days ?? 0} days
                </span>
                <span className="font-bold text-foreground">
                  {safeProduct.shipping?.free ? 'FREE' : `AED ${((safeProduct.shipping?.days ?? 0) * 10).toFixed(2)}`}
                </span>
              </div>
              <div className="mt-0.5 flex items-center justify-between text-sm text-muted-foreground">
                <span>Priority 48H</span>
                <span>To {safeProduct.shipping?.from ?? 'UAE'}</span>
              </div>
            </div>
          </button>

          {/* Variant selector row */}
          {safeProduct.colors.length > 0 && (
            <button className="flex w-full items-center gap-3 border-t border-border px-4 py-3.5">
              <div className="flex gap-1.5">
                {safeProduct.images.slice(0, 2).map((src, i) => (
                  <img
                    key={i}
                    src={src || '/placeholder.svg'}
                    alt=""
                    className="h-10 w-10 rounded border border-border object-cover"
                    crossOrigin="anonymous"
                  />
                ))}
              </div>
              <span className="flex-1 text-right text-base font-semibold text-foreground">
                {safeProduct.colors[selectedColor] || safeProduct.colors[0] || 'N/A'}
                {safeProduct.sizes?.[0] ? `, ${safeProduct.sizes[0]}` : ''}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="h-2 bg-muted" />

        {/* Vouchers */}
        <div className="bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Vouchers</h2>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[49, 99].map((min) => (
              <div key={min} className="rounded-xl border border-[#06A589]/30 p-3 text-center">
                <p className="text-2xl font-extrabold text-[#06A589]">AED 30</p>
                <p className="text-xs text-muted-foreground">Min. Spend AED {min}</p>
                <button className="mt-2 w-full rounded-md bg-[#06A589] py-1.5 text-sm font-bold text-white">
                  Collect
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-2 bg-muted" />

        {/* Buyer gallery */}
        <div className="bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              Buyer Gallery <span className="text-muted-foreground">(203)</span>
            </h2>
            <button className="flex items-center gap-1 text-sm text-muted-foreground">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {(safeProduct.images ?? []).concat(safeProduct.images ?? []).slice(0, 4).map((src, i) => (
              <div key={i} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={src || '/placeholder.svg'}
                  alt={`Buyer photo ${i + 1}`}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-2 bg-muted" />

      {/* Reviews section */}
      <div ref={sectionRefs.Reviews}>
        <ProductReviews rating={safeProduct.rating} totalReviews={safeProduct.reviews} />
      </div>

      <div className="h-2 bg-muted" />

      {/* Product Details section */}
      <div ref={sectionRefs['Product Details']} className="bg-white">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Specifications</h2>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-border">
            {Object.entries(safeProduct.specifications ?? {}).map(([key, value]) => (
              <div key={key} className="bg-muted/50 p-3">
                <p className="text-xs capitalize text-muted-foreground">{key.replace(/_/g, ' ')}</p>
                <p className="mt-1 text-sm font-bold text-foreground">{value ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border px-4 py-4">
          <h2 className="text-lg font-bold text-foreground">Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{safeProduct.description ?? 'No description available'}</p>
          {safeProduct.images?.[1] && (
            <img
              src={safeProduct.images[1] || '/placeholder.svg'}
              alt={title}
              className="mt-3 w-full rounded-lg object-cover"
              crossOrigin="anonymous"
            />
          )}
        </div>

        <div className="border-t border-border px-4 py-4">
          <h3 className="text-base font-bold text-foreground">Disclaimer</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Promotion and price above are valid through 06/05/2026
          </p>
        </div>
      </div>

      <div className="h-2 bg-muted" />

      {/* Recommendations / Seller + Similar items */}
      <div ref={sectionRefs.Recommendations}>
        <SellerSimilar productHandle={safeProduct.id} seller={safeProduct.seller} />
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t border-border bg-white">
        <button className="flex w-16 flex-col items-center justify-center gap-0.5 py-2 text-muted-foreground">
          <Store className="h-5 w-5" />
          <span className="text-[10px]">Store</span>
        </button>
        <button className="flex w-16 flex-col items-center justify-center gap-0.5 py-2 text-muted-foreground">
          <MessageCircle className="h-5 w-5" />
          <span className="text-[10px]">Chat</span>
        </button>
        <button className="flex-1 bg-[#FF9500] text-base font-bold text-white">Buy Now</button>
        <button className="flex-1 bg-primary text-base font-bold text-primary-foreground">Add to Cart</button>
      </div>
    </div>
  )
}
