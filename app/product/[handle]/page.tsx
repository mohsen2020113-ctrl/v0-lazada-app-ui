'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Heart, Share2, ShoppingCart, Star, Shield, RotateCcw,
  Truck, Search, ChevronRight, ChevronLeft, Store,
  MessageCircle, Package, Award, ZoomIn, ThumbsUp,
  Clock, Eye, Tag, TrendingUp, CheckCircle
} from 'lucide-react'

interface Variant {
  id: string
  title: string
  price: string
  available: boolean
  compareAtPrice?: string
}

interface Product {
  id: string
  title: string
  handle: string
  description: string
  images: string[]
  variants: Variant[]
  price: string
}

interface RelatedProduct {
  id: string
  title: string
  handle: string
  price: string
  image: string
  compareAtPrice?: string
}

const MOCK_REVIEWS = [
  { id: 1, name: 'Ø£Ø­ÙØ¯ ÙØ­ÙØ¯', rating: 5, date: 'ÙÙØ° 3 Ø£ÙØ§Ù', comment: 'ÙÙØªØ¬ ÙÙØªØ§Ø² Ø¬Ø¯Ø§ÙØ Ø§ÙØ¬ÙØ¯Ø© Ø±Ø§Ø¦Ø¹Ø© ÙØ³Ø±ÙØ¹ Ø§ÙØ´Ø­Ù. Ø£ÙØµØ­ Ø¨Ù Ø¨Ø´Ø¯Ø©.', helpful: 24, verified: true, avatar: 'Ø£' },
  { id: 2, name: 'Ø³Ø§Ø±Ø© Ø¹ÙÙ', rating: 5, date: 'ÙÙØ° Ø£Ø³Ø¨ÙØ¹', comment: 'ÙØµÙ Ø¨Ø´ÙÙ Ø³Ø±ÙØ¹ ÙØ§ÙØªØºÙÙÙ ÙØ§Ù ÙÙØªØ§Ø²Ø§Ù. Ø§ÙÙÙØªØ¬ ÙØ·Ø§Ø¨Ù Ø§ÙÙØµÙ ØªÙØ§ÙØ§Ù.', helpful: 18, verified: true, avatar: 'Ø³' },
  { id: 3, name: 'ÙØ­ÙØ¯ Ø®Ø§ÙØ¯', rating: 4, date: 'ÙÙØ° Ø£Ø³Ø¨ÙØ¹ÙÙ', comment: 'ÙÙØªØ¬ Ø¬ÙØ¯ ÙÙÙ Ø§ÙØªÙØµÙÙ ØªØ£Ø®Ø± ÙÙÙÙØ§Ù. Ø§ÙØ¬ÙØ¯Ø© ÙÙØ¨ÙÙØ© Ø¨ÙØ°Ø§ Ø§ÙØ³Ø¹Ø±.', helpful: 12, verified: true, avatar: 'Ù' },
  { id: 4, name: 'ÙØ§Ø·ÙØ© Ø­Ø³Ù', rating: 5, date: 'ÙÙØ° Ø´ÙØ±', comment: 'Ø£ÙØ¶Ù ÙÙØªØ¬ Ø§Ø´ØªØ±ÙØªÙ ÙÙ ÙØ°Ø§ Ø§ÙÙØªØ¬Ø±! Ø³Ø£Ø´ØªØ±Ù ÙØ¬Ø¯Ø¯Ø§Ù Ø¨Ø§ÙØªØ£ÙÙØ¯.', helpful: 31, verified: true, avatar: 'Ù' },
]

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const handle = params.handle as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description')
  const [addedToCart, setAddedToCart] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<RelatedProduct[]>([])
  const [helpfulVotes, setHelpfulVotes] = useState<Set<number>>(new Set())
  const [reviewSortBy, setReviewSortBy] = useState<'newest' | 'helpful'>('newest')

  useEffect(() => {
    if (!handle) return
    fetch(`/api/product/${handle}`)
      .then(r => r.json())
      .then((d: Product) => {
        setProduct(d)
        setLoading(false)
        // Save to recently viewed in localStorage
        try {
          const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
          const item: RelatedProduct = {
            id: d.id,
            title: d.title,
            handle: d.handle,
            price: d.price,
            image: d.images?.[0] || '',
          }
          const filtered = viewed.filter((v: RelatedProduct) => v.handle !== d.handle)
          const updated = [item, ...filtered].slice(0, 8)
          localStorage.setItem('recentlyViewed', JSON.stringify(updated))
        } catch {}
      })
      .catch(() => setLoading(false))
  }, [handle])

  // Fetch related products
  useEffect(() => {
    fetch('/api/products?limit=8')
      .then(r => r.json())
      .then((data) => {
        const products = (data.products || data || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          handle: p.handle,
          price: p.price || p.priceRange?.minVariantPrice?.amount || '0',
          image: p.image || p.images?.[0] || p.featuredImage?.url || '',
          compareAtPrice: p.compareAtPrice,
        })).filter((p: RelatedProduct) => p.handle !== handle).slice(0, 6)
        setRelatedProducts(products)
      })
      .catch(() => {})
  }, [handle])

  // Load recently viewed from localStorage
  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      setRecentlyViewed(viewed.filter((v: RelatedProduct) => v.handle !== handle).slice(0, 6))
    } catch {}
  }, [handle])

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#F50057] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Ø¬Ø§Ø±Ù ØªØ­ÙÙÙ Ø§ÙÙÙØªØ¬...</p>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4" dir="rtl">
      <p className="text-gray-500">Ø§ÙÙÙØªØ¬ ØºÙØ± ÙÙØ¬ÙØ¯</p>
      <button onClick={() => router.push('/')} className="bg-[#F50057] text-white px-6 py-2 rounded-lg text-sm">
        Ø§ÙØ¹ÙØ¯Ø© ÙÙØ±Ø¦ÙØ³ÙØ©
      </button>
    </div>
  )

  const variant = product.variants?.[selectedVariant] || { price: product.price, available: true, title: '', id: product.id }
  const images = product.images?.length ? product.images : ['/placeholder.png']
  const hasVariants = (product.variants?.length ?? 0) > 1
  const discount = variant.compareAtPrice
    ? Math.round((1 - parseFloat(variant.price) / parseFloat(variant.compareAtPrice)) * 100)
    : 0

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const sortedReviews = [...MOCK_REVIEWS].sort((a, b) =>
    reviewSortBy === 'helpful' ? b.helpful - a.helpful : b.id - a.id
  )

  const ratingBreakdown = [
    { stars: 5, pct: 75, count: 1531 },
    { stars: 4, pct: 15, count: 306 },
    { stars: 3, pct: 5, count: 102 },
    { stars: 2, pct: 3, count: 61 },
    { stars: 1, pct: 2, count: 42 },
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* ===== HEADER ===== */}
      <header className="bg-[#F50057] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="text-white font-black text-2xl tracking-tight flex-shrink-0">
            4LEEE
          </button>
          <div className="flex-1 relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ø§Ø¨Ø­Ø« ÙÙ 4LEEE..."
              className="w-full pr-9 pl-4 py-2.5 rounded-lg text-sm bg-white text-gray-800 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setWishlist(!wishlist)}
              className="flex flex-col items-center gap-0.5"
            >
              <Heart size={22} className={wishlist ? 'text-yellow-300 fill-yellow-300' : 'text-white'} />
              <span className="text-white text-[10px]">Ø§ÙÙØ§Ø¦ÙØ©</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 relative">
              <div className="relative">
                <ShoppingCart size={22} className="text-white" />
                <span className="absolute -top-1 -left-1 bg-yellow-400 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
              </div>
              <span className="text-white text-[10px]">Ø§ÙØ³ÙØ©</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold">Ù</span>
              </div>
              <span className="text-white text-[10px]">Ø­Ø³Ø§Ø¨Ù</span>
            </button>
          </div>
        </div>
        {/* Sub-nav */}
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2 overflow-x-auto scrollbar-hide text-sm text-white/90">
            {['Ø§ÙØ±Ø¦ÙØ³ÙØ©','Ø§ÙØ¥ÙÙØªØ±ÙÙÙØ§Øª','Ø§ÙÙÙØ¶Ø©','Ø§ÙÙÙØ²Ù','Ø§ÙØ¬ÙØ§Ù','Ø§ÙØ±ÙØ§Ø¶Ø©','Ø¹Ø±ÙØ¶ Ø§ÙÙÙÙ','ÙØ§Ø±ÙØ§Öª'].map((cat, i) => (
              <button key={i} className="whitespace-nowrap hover:text-white transition-colors">{cat}</button>
            ))}
          </div>
        </div>
      </header>

      {/* ===== BREADCRUMBS ===== */}
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <button className="hover:text-[#F50057] transition-colors">Ø§ÙØ±Ø¦ÙØ³ÙØ©</button>
          <ChevronLeft size={12} />
          <button className="hover:text-[#F50057] transition-colors">Ø§ÙØ¥ÙÙØªØ±ÙÙÙØ§Øª</button>
          <ChevronLeft size={12} />
          <span className="text-gray-700 font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* ===== MAIN PRODUCT CARD ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* LEFT: Images */}
            <div className="lg:w-[45%] p-6 flex flex-col gap-4">
              <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square">
                {discount > 0 && (
                  <div className="absolute top-3 right-3 z-10 bg-[#F50057] text-white text-xs font-bold px-2 py-1 rounded-md">
                    -{discount}%
                  </div>
                )}
                <button className="absolute top-3 left-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
                  <ZoomIn size={16} className="text-gray-600" />
                </button>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(p => (p === 0 ? images.length - 1 : p - 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center"
                    >
                      <ChevronRight size={18} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => setCurrentImage(p => (p + 1) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center"
                    >
                      <ChevronLeft size={18} className="text-gray-700" />
                    </button>
                  </>
                )}
                <img
                  src={images[currentImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImage === i ? 'border-[#F50057]' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {/* Share */}
              <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
                <span>ÙØ´Ø§Ø±ÙØ©:</span>
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#F50057] transition-colors">
                  <Share2 size={16} />
                  <span>ÙØ´Ø§Ø±ÙØ©</span>
                </button>
              </div>
            </div>

            {/* RIGHT: Info */}
            <div className="lg:w-[55%] p-6 flex flex-col gap-4">
              {/* Title + Wishlist */}
              <div className="flex items-start gap-3">
                <h1 className="flex-1 text-xl font-bold text-gray-900 leading-snug">{product.title}</h1>
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`p-2 rounded-full border transition-colors flex-shrink-0 ${
                    wishlist ? 'border-[#F50057] bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <Heart size={20} className={wishlist ? 'fill-[#F50057] text-[#F50057]' : 'text-gray-400'} />
                </button>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-yellow-500 font-bold text-sm">4.9</span>
                <button className="text-[#F50057] text-sm hover:underline">2,042 ØªÙÙÙÙ</button>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <TrendingUp size={14} className="text-green-500" />
                  +5,000 ÙØ¨ÙØ¹Ø§Ù
                </span>
              </div>

              {/* Price Block */}
              <div className="bg-gradient-to-l from-red-50 to-pink-50 rounded-xl p-4 border border-pink-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#F50057]">
                    {variant.price} <span className="text-lg">Ø¯.Ø¥</span>
                  </span>
                  {variant.compareAtPrice && (
                    <span className="text-gray-400 line-through text-base">{variant.compareAtPrice} Ø¯.Ø¥</span>
                  )}
                  {discount > 0 && (
                    <span className="bg-[#F50057] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                      ÙÙÙØ± {discount}%
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  Ø§ÙØ³Ø¹Ø± Ø´Ø§ÙÙ Ø¶Ø±ÙØ¨Ø© Ø§ÙÙÙÙØ© Ø§ÙÙØ¶Ø§ÙØ©
                </p>
              </div>

              {/* Store Info */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="text-gray-500 text-xs mb-2">ÙØ¨Ø§Ø¹ Ø¨ÙØ§Ø³Ø·Ø©</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#F50057] rounded-lg flex items-center justify-center">
                      <Store size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Better Home Life - Official Store</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">Store 7600</span>
                        <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">ÙØªØ¬Ø± Ø±Ø³ÙÙ â</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-xs text-[#F50057] border border-[#F50057] px-3 py-1.5 rounded-lg hover:bsg-red-50 transition-colors font-medium">
                   Ø²ÙØ§Ø±Ø© Ø§ÙÙØªØ¬Ø±
                  </button>
                </div>
              </div>

              {/* Variants */}
              {hasVariants && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Ø§ÙØ®ÙØ§Ø±Ø§Öª Ø§ÙÙØªØ§Ø­Ø©</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(i)}
                        className={`px-4 py-2 rounded-lg text-sm border-2 transition-all ${
                          selectedVariant === i
                            ? 'border-[#F50057] bg-red-50 text-[#F50057] font-medium'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        } ${!v.available ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Stock */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Ø§ÙÙÙÙØ©</p>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 bg-gray-50 text-gray-700 text-lg hover:bg-gray-100 transition-colors font-bold"
                    >
                      â
                    </button>
                    <span className="w-14 text-center text-base font-semibold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 bg-gray-50 text-gray-700 text-lg hover:bg-gray-100 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium mt-6">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  ÙØªÙÙØ± ÙÙ Ø§ÙÙØ®Ø²ÙÙ
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!variant.available}
                  className={`flex-1 h-13 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-sm ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : !variant.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#F50057] text-white hover:bg-[#d4004d] active:scale-95'
                  }`}
                >
                  <ShoppingCart size={20} />
                  {!variant.available ? 'ÙÙØ¯ Ø§ÙÙØ®Ø²ÙÙ' : addedToCart ? 'ØªÙØª Ø§ÙØ¥Ø¸Ø§ÙØ© â' : 'Ø£ØºÙ Ø¥ÙÙ Ø§ÙØ³ÙØ© ð¥'}
                </button>
                <button
                  disabled={!variant.available}
                  className="flex-1 py-3.5 rounded-xl font-bold text-base bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all shadow-sm disabled:opacity-40"
                >
                  Ø§Ø´ØªØ±Ù Ø§ÙØ¢Ù ð±
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: <Truck size={18} className="text-[#F50057]" />, title: 'Ø´Ø­Ù ÙØ¬Ø§ÙÙ', sub: 'ÙÙÙ AED 200' },
                  { icon: <RotateCcw size={18} className="text-[#F50057]" />, title: 'Ø¥Ø±Ø¬Ø§Ø¹ ÙØ¬Ø§ÙÙ', sub: 'Ø®ÙØ§Ù 14 ÙÙÙ' },
                  { icon: <Shield size={18} className="text-[#F50057]" />, title: 'ÙÙØªØ¬ Ø£ØµÙÙ', sub: '100% ÙØ¶ÙÙÙ' },
                ].map((g, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl gap-1">
                    {g.icon}
                    <span className="text-xs font-semibold text-gray-700">{g.title}</span>
                    <span className="text-[10px] text-gray-400">{g.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABS SECTION ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'description', label: 'ØªÙØ§ØµÙÙ Ø§ÙÙÙØªØ¬' },
              { key: 'reviews', label: `Ø§ÙØªÙÙÙÙØ§Öª (2,042)` },
              { key: 'shipping', label: 'Ø§ÙØ´Ø­Ù ÙØ§ÙØ¥Ø±Ø¬Ø§Ø¹' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.key ? 'text-[#F50057]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F50057] rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="text-gray-700 text-sm leading-8">
                {product.description || 'ÙØ§ ÙÙØªØ¯ ÙØµÙ ÙØªØ§Ø­ ÙÙØ°Ø§ Ø§ÙÙÙØªØ¬.'}
              </div>
            )}
            {activeTab === 'reviews' && (
              <p className="text-gray-500 text-sm text-center py-4">Ø§Ø·ÙÙØ¹ Ø¹ÙÙ Ø§ÙØªÙÙÙÙØ§Öª Ø§ÙØªÙØµÙÙÙØ§Öª Ø£Ø¯ÙØ§</p>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <Truck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">Ø´Ø­Ù ÙØ¬Ø§ÙÙ</p>
                    <p className="text-blue-700 mt-1">ÙÙØ·ÙØ¨Ø§Øª Ø§ÙØªÙ ØªØªØ¬Ø§ÙØ² 200 Ø¯Ø±ÙÙ Ø¥ÙØ§Ø±Ø§ØªÙ. Ø§ÙØªÙØµÙÙ Ø®ÙØ§Ù 3-5 Ø£ÙØ§Ù Ø¹ÙÙ.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <RotateCcw size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Ø³ÙØ§Ø³Ø© Ø§ÙØ¥Ø±Ø¬Ø§Ø¹</p>
                    <p className="text-green-700 mt-1">Ø¥Ø±Ø¬Ø§Ø¹ ÙØ¬Ø§ÙÙ Ø®ÙØ§Ù 14 ÙÙÙØ§Ù ÙÙ Ø§Ø³ØªÙØ§Ù Ø§ÙÙÙØªØ¬ Ø¨Ø´Ø±Ø· Ø£Ù ÙÙÙÙ Ø¨Ø­Ø§ÙØªÙ Ø§ÙØ£ØµÙÙØ©.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <Shield size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-900">Ø¶ÙØ§Ù Ø§ÙØ£ØµØ§ÙØ©</p>
                    <p className="text-purple-700 mt-1">Ø¬ÙÙØ¹ ÙÙØªØ¬Ø§ÖªÙØ§ Ø£ØµÙÙØ© 100% ÙØ¶ÙÙÙØ©. ÙØ¹ÙÙ ÙØ¹ ÙÙØ±Ø¯ÙÙ ÙØ¹ØªÙØ¯ÙÙ ÙÙØ·.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== RELATED PRODUCTS ===== */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag size={20} className="text-[#F50057]" />
                ÙÙØªØ¬Ø§Ùª ÙØ´Ø§Ø¨ÙØ©
              </h2>
              <button className="text-sm text-[#F50057] hover:underline font-medium">Ø¹Ø±Ø¶ Ø§ÙÙÙ</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {relatedProducts.map(rp => (
                <button
                  key={rp.id}
                  onClick={() => router.push(`/product/${rp.handle}`)}
                  className="group text-right hover:shadow-md transition-shadow rounded-xl overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {rp.image ? (
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={28} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-4 mb-1">{rp.title}</p>
                    <p className="text-sm font-bold text-[#F50057]">{rp.price} Ø¯.Ø¥</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== DETAILED REVIEWS ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
            ØªÙÙÙÙØ§Ùª Ø§ÙØ¹ÙÙØ§Ø¡
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Rating Summary */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="text-center mb-4">
                <div className="text-6xl font-black text-gray-900">4.9</div>
                <div className="flex items-center justify-center gap-1 my-2">
                  {[1,2,3,4,5].map(s => <Star key={s} size={20} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-500 text-sm">Ø¨ÙØ§Ø¡Ù Ø¹ÙÙ 2,042 ØªÙÙÙÙ</p>
              </div>
              <div className="space-y-2">
                {ratingBreakdown.map(r => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-10 text-left">{r.stars} â</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{r.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-xl font-bold text-green-600">98%</p>
                    <p className="text-xs text-gray-500">Ø±Ø§Ø¶ÙÙ Ø¹Ù Ø§ÙÙÙØªØ¬</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-xl font-bold text-blue-600">95%</p>
                    <p className="text-xs text-gray-500">Ø³ÙØ¸ØªØ±ÙÙ ÙØ¬Ø¯Ø¯Ø§Ù</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">{sortedReviews.length} ØªÙÙÙÙ ÙØ¹Ø±ÙØ¶</p>
                <select
                  value={reviewSortBy}
                  onChange={e => setReviewSortBy(e.target.value as any)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-700"
                >
                  <option value="newest">Ø§ÙØ£Ø­Ø¯Ø«</option>
                  <option value="helpful">Ø§ÙØ£ÙØ«Ø± ÙØ§Ø¦Ø¯Ø©</option>
                </select>
              </div>
              <div className="space-y-4">
                {sortedReviews.map(review => (
                  <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F50057] flex items-center justify-center text-white font-bold flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex items-center gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} size={12} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                                ))}
                              </div>
                              {review.verified && (
                                <span className="text-xs text-green-600 flex items-center gap-0.5">
                                  <CheckCircle size={10} />
                                  ÙØ´ØªØ±Ù ÙÙØ«ÙÙ
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2 leading-6">{review.comment}</p>
                        <button
                          onClick={() => {
                            const next = new Set(helpfulVotes)
                            if (next.has(review.id)) next.delete(review.id)
                            else next.add(review.id)
                            setHelpfulVotes(next)
                          }}
                          className={`flex items-center gap-1.5 mt-3 text-xs transition-colors ${
                            helpfulVotes.has(review.id) ? 'text-[#F50057]' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <ThumbsUp size={12} />
                          ÙÙÙØ¯ ({review.helpful + (helpfulVotes.has(review.id) ? 1 : 0)})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#F50057] hover:text-[#F50057] transition-colors font-medium">
                Ø¹Ø±Ø¶ Ø¬ÙÙØ¹ Ø§ÙØªÙÙÙÙØ§Öª (2,042)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RECENTLY VIEWED ===== */}
      {recentlyViewed.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Clock size={20} className="text-gray-500" />
              Ø´Ø§ÙØ¯ØªÙØ§ ÙØ¤Ø®Ø±Ø§Ù
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recentlyViewed.map(rp => (
                <button
                  key={rp.id}
                  onClick={() => router.push(`/product/${rp.handle}`)}
                  className="group text-right hover:shadow-md transition-shadow rounded-xl overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {rp.image ? (
                      <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={28} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-4 mb-1">{rp.title}</p>
                    <p className="text-sm font-bold text-[#F50057]">{rp.price} Ø¯.Ø¥</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== CHAT SUPPORT BANNER ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-gradient-to-l from-pink-50 to-red-50 border border-pink-100 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F50057] rounded-full flex items-center justify-center">
              <MessageCircle size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800">ÙÙ ÙØ¯ÙÙ Ø³Ø¤Ø§ÙØ</p>
              <p className="text-gray-500 text-sm">ØªÙØ§ØµÙ ÙØ¹ Ø®Ø¯ÙØ© Ø§ÙØ¹ÙÙØ§Ø¡ Ø£Ù Ø§ÙØ¨Ø§ÙØ¹ ÙØ¨Ø§Ø¸Ø±Ø©</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#F50057] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#d4004d] transition-colors flex items-center gap-2">
              <MessageCircle size={16} />
              Ø§ÙØ¯Ø±Ø¯Ø¸Ø©
            </button>
            <button className="border-2 border-[#F50057] text-[#F50057] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors flex items-center gap-2">
              <Store size={16} />
              Ø²ÙØ§Ø±Ø© Ø§ÙÙØªØ¬Ø±
            </button>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white mt-4">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-black text-[#F50057] mb-3">4LEEE</h3>
              <p className="text-gray-400 text-sm">Ø§ÙØªØ³ÙÙ Ø§ÙØ£ÙØ¸Ù ÙÙ 260 Ø¯ÙÙØ© Ø­ÙÙ Ø§ÙØ¹Ø§ÙÙ</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">ÙØ³Ø§Ø¹Ø¯Ø©</h4>
              {['ØªØªØ¨Ø¹ Ø·ÙØ¨Ù','Ø³ÙØ§Ø³Ø© Ø§ÙØ¥Ø±Ø¬Ø§Ø¹','Ø·Ø±Ù Ø§ÙØ¯ÙØ¹','Ø§ØªØµÙ Ø¨ÙØ§'].map(l => (
                <p key={l} className="text-gray-400 text-sm mb-2 cursor-pointer hover:text-white transition-colors">{l}</p>
              ))}
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Ø§ÙØ¨Ø§Ø¦Ø¹ÙÙ</h4>
              {['Ø¨ÙÙ Ø¹ÙÙ 4LEEE','Ø¯ÙÙÙ Ø§ÙØ¨Ø§ÙØ¹','ÙØ±ÙØ² Ø§ÙØ¨Ø§ÙØ¹'].map(l => (
                <p key={l} className="text-gray-400 text-sm mb-2 cursor-pointer hover:text-white transition-colors">{l}</p>
              ))}
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">ØªØ§Ø¨Ø¹ÙØ§</h4>
              {['Instagram','Twitter','TikTok','YouTube'].map(l => (
                <p key={l} className="text-gray-400 text-sm mb-2 cursor-pointer hover:text-white transition-colors">{l}</p>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
            Â© 2024 4LEEE. Ø¬ÙÙØ¹ Ø§ÙØ­ÙÙÙ ÙØ­ÙÙØ¸Ø©.
          </div>
        </div>
      </footer>
    </div>
  )
}
