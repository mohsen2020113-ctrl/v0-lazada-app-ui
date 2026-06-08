'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Search, Share2, ShoppingCart, Heart, Star } from 'lucide-react'
import { ProductGallery } from '@/components/product/product-gallery'

interface Product {
  id: string
  name: string
  nameEn: string
  price: number
  originalPrice: number
  discount: number
  category: string
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
  isNew: boolean
  isFeatured: boolean
  tags: string[]
}

const TABS = ['Overview', 'Reviews', 'Product Details', 'Recommendations']

export function ProductPageClient({ handle }: { handle: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Overview')

  useEffect(() => {
    if (!handle) {
      setError('Product not found')
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${handle}`)
        if (!response.ok) throw new Error('Product not found')
        const data = await response.json()
        setProduct(data)
        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">خطأ</h2>
        <p className="text-muted-foreground text-center px-4">{error || 'لم يتم العثور على المنتج'}</p>
        <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          العودة
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
        <div className="flex items-center gap-2 px-3 py-3">
          <button onClick={() => window.history.back()} aria-label="Back" className="p-1">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-lg border-2 border-[#E91E63] px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search in 4LEEE"
              className="flex-1 bg-transparent text-sm placeholder-muted-foreground outline-none"
            />
          </div>
          <button aria-label="Share" className="p-1">
            <Share2 className="h-5 w-5 text-foreground" />
          </button>
          <button aria-label="Cart" className="relative p-1">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E91E63] px-0.5 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <button aria-label="More" className="p-1 text-xl">
            ⋯
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-4 overflow-x-auto px-4 py-2 border-t border-border scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-2 pt-1 text-sm font-semibold transition-colors ${
                activeTab === tab ? 'border-b-2 border-[#E91E63] text-[#E91E63]' : 'text-muted-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Product Gallery */}
      <section className="bg-white">
        <ProductGallery images={product.images || []} alt={product.name} discount={product.discount} />
      </section>

      {/* Price & Basic Info */}
      <section className="border-b border-border px-4 py-4 bg-white">
        {/* Images Carousel for variants */}
        <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide">
          {product.images?.slice(0, 5).map((img, i) => (
            <button key={i} className="flex-shrink-0 h-12 w-12 rounded border border-border overflow-hidden">
              <img src={img} alt={`Variant ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        {/* Price Display */}
        <div className="flex items-center gap-3 pb-3">
          <span className="text-2xl font-bold text-[#E91E63]">฿{product.price.toFixed(2)}</span>
          <span className="text-sm line-through text-muted-foreground">฿{product.originalPrice.toFixed(2)}</span>
          <span className="text-xs font-semibold bg-[#FF3B30] text-white px-2 py-1 rounded">-{product.discount}%</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pb-4">
          {product.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs font-medium bg-muted px-2 py-1 rounded text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Shipping & Rating */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#FFB400] text-[#FFB400]" />
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
            </div>
            <span className="text-xs text-muted-foreground">{product.sold.toLocaleString()} عملية بيع</span>
          </div>
          <button className="p-2">
            <Heart className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Shipping Info */}
        <div className="pt-3 text-sm">
          <p className="text-muted-foreground">
            {product.shipping.free ? '🚚 شحن مجاني' : `🚚 شحن: ${product.shipping.days} أيام`}
          </p>
        </div>
      </section>

      {/* Product Details by Tab */}
      <section className="px-4 py-6 bg-white">
        {activeTab === 'Overview' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">المواصفات</h4>
              <div className="space-y-2">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">التقييمات ({product.reviews})</h3>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <span className="text-2xl font-bold text-foreground">{product.rating}</span>
              <div>
                <div className="flex gap-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-[#FFB400] text-[#FFB400]' : 'text-border'}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{product.reviews} تقييم</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Product Details' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">تفاصيل المنتج</h3>
            <div className="grid gap-3">
              {Object.entries({
                'الفئة': product.category,
                'المخزون': product.stock,
                'البائع': product.seller?.name,
                'تصنيف البائع': `${product.seller?.rating}⭐`,
              }).map(([label, value]) => (
                <div key={label} className="flex justify-between pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Recommendations' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">منتجات موصى بها</h3>
            <p className="text-sm text-muted-foreground">منتجات مشابهة قريباً</p>
          </div>
        )}
      </section>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg flex items-center justify-between gap-2 px-3 py-2 z-30">
        <div className="flex gap-2 flex-1">
          <button className="flex-1 flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium py-3 hover:bg-muted rounded-lg transition-colors">
            <span>🏪</span>
            <span className="hidden sm:inline">متجر</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium py-3 hover:bg-muted rounded-lg transition-colors">
            <span>💬</span>
            <span className="hidden sm:inline">دردشة</span>
          </button>
        </div>
        <button className="flex-1 bg-[#FF9500] hover:bg-[#F08500] text-white font-semibold py-3 rounded-lg transition-colors text-sm">
          اشتر الآن
        </button>
        <button className="flex-1 bg-[#E91E63] hover:bg-[#d41e6f] text-white font-semibold py-3 rounded-lg transition-colors text-sm">
          أضف للعربة
        </button>
      </div>
    </div>
  )
}
