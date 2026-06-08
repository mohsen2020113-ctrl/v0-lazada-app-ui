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

const TABS = ['Overview', 'Reviews', 'Product Details', 'Recommendations'] as const
type Tab = (typeof TABS)[number]

export default function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
    fetch(`/api/products/${handle}`)
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
        setError(err instanceof Error ? err.message : 'Failed to load product')
      })
      .finally(() => setLoading(false))
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

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground mb-2">حدث خطأ ما</p>
          <p className="text-muted-foreground mb-4">
            {error ? error : 'المنتج غير متوفر حالياً'}
          </p>
        </div>
        <button 
          onClick={handleGoBack} 
          className="rounded bg-primary px-6 py-2 text-primary-foreground font-semibold"
        >
          العودة للخلف
        </button>
      </div>
    )
  }

  const title = product.nameEn || product.name

  return (
    <div className="min-h-screen bg-muted pb-20">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button onClick={handleGoBack} aria-label="Back" className="p-1">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-full border-2 border-primary px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search in 4LEEE</span>
          </div>
          <button aria-label="Share" className="p-1">
            <Share2 className="h-6 w-6 text-foreground" />
          </button>
          <button aria-label="Cart" className="relative p-1">
            <ShoppingCart className="h-6 w-6 text-foreground" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              3
            </span>
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-6 overflow-x-auto px-4 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => scrollToSection(tab)}
              className={`relative whitespace-nowrap pb-2.5 pt-1 text-base font-semibold ${
                activeTab === tab ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded bg-primary" />
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Overview anchor */}
      <div ref={sectionRefs.Overview}>
        <ProductGallery images={product.images} alt={title} discount={product.discount} />

        {/* Variant thumbnails carousel */}
        <div className="flex gap-2 overflow-x-auto bg-white px-4 py-3 scrollbar-hide">
          {product.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedColor(i)}
              className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                selectedColor === i ? 'border-primary' : 'border-transparent'
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
            <span className="text-3xl font-extrabold text-primary">AED {product.price.toFixed(2)}</span>
            <span className="mb-1 text-base text-muted-foreground line-through">
              AED {product.originalPrice.toFixed(2)}
            </span>
            <span className="mb-1 rounded bg-[#FFE9F2] px-1.5 py-0.5 text-sm font-bold text-primary">
              -{product.discount}%
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
          {product.tags.length > 0 && (
            <p className="mt-2 text-sm font-semibold text-[#A05A2C]">
              {product.tags.slice(0, 2).join('  |  ')}
            </p>
          )}

          {/* Rating row */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-[#FFB400] text-[#FFB400]" />
              <span className="font-bold text-foreground">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews})</span>
              <span className="text-border">|</span>
              <span className="text-muted-foreground">{product.sold.toLocaleString()} sold</span>
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
                  Guaranteed by {product.shipping.days} days
                </span>
                <span className="font-bold text-foreground">
                  {product.shipping.free ? 'FREE' : `AED ${(product.shipping.days * 10).toFixed(2)}`}
                </span>
              </div>
              <div className="mt-0.5 flex items-center justify-between text-sm text-muted-foreground">
                <span>Priority 48H</span>
                <span>To {product.shipping.from}</span>
              </div>
            </div>
          </button>

          {/* Variant selector row */}
          {product.colors.length > 0 && (
            <button className="flex w-full items-center gap-3 border-t border-border px-4 py-3.5">
              <div className="flex gap-1.5">
                {product.images.slice(0, 2).map((src, i) => (
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
                {product.colors[selectedColor] || product.colors[0]}
                {product.sizes[0] ? `, ${product.sizes[0]}` : ''}
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
            {product.images.concat(product.images).slice(0, 4).map((src, i) => (
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
        <ProductReviews rating={product.rating} totalReviews={product.reviews} />
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
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="bg-muted/50 p-3">
                <p className="text-xs capitalize text-muted-foreground">{key.replace(/_/g, ' ')}</p>
                <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border px-4 py-4">
          <h2 className="text-lg font-bold text-foreground">Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{product.description}</p>
          {product.images[1] && (
            <img
              src={product.images[1] || '/placeholder.svg'}
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
        <SellerSimilar productHandle={product.id} seller={product.seller} />
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
