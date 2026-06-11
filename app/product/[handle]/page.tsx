'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Heart, Share2, ShoppingCart, MessageCircle, Store, Star, Shield, RotateCcw, Truck, Search } from 'lucide-react'

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

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const handle = params.handle as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [currentImage, setCurrentImage] = useState(0)
  const [wishlist, setWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos')
  const [cartCount] = useState(3)

  useEffect(() => {
    if (!handle) return
    fetch(`/api/product/${handle}`)
      .then(r => r.json())
      .then(d => { setProduct(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [handle])

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#F50057] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">المنتج غير موجود</p>
      <button onClick={() => router.back()} className="text-[#F50057] text-sm">العودة</button>
    </div>
  )

  const variant = product.variants?.[selectedVariant] || { price: product.price, available: true, title: '', id: product.id }
  const images = product.images?.length ? product.images : ['/placeholder.png']
  const price = parseFloat(variant.price || '0')
  const comparePrice = parseFloat(variant.compareAtPrice || '0')
  const discount = variant.compareAtPrice && comparePrice > price
    ? Math.round((1 - price / comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white pb-32 max-w-md mx-auto relative" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex-1 flex items-center border border-[#F50057] rounded-full px-3 py-1.5 bg-gray-50">
          <Search size={14} className="text-gray-400 ml-1" />
          <span className="text-gray-400 text-sm">بحث في 4LEEE</span>
        </div>
        <div className="relative">
          <ShoppingCart size={22} className="text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#F50057] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'photos' ? 'text-[#F50057] border-b-2 border-[#F50057]' : 'text-gray-400'}`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'video' ? 'text-[#F50057] border-b-2 border-[#F50057]' : 'text-gray-400'}`}
          >
            Video
          </button>
        </div>

        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={images[currentImage]}
            alt={product.title}
            className="w-full h-full object-contain"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              {discount}%-
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 px-3 py-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-14 h-14 shrink-0 rounded border-2 overflow-hidden ${i === currentImage ? 'border-[#F50057]' : 'border-gray-200'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-3 py-3 bg-white">
        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[#F50057] font-extrabold text-2xl leading-none">
            {price.toFixed(2)} AED
          </span>
          {variant.compareAtPrice && comparePrice > price && (
            <span className="text-gray-400 text-sm line-through">
              {comparePrice.toFixed(2)} AED
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-gray-900 font-semibold text-sm leading-snug mb-3">
          {product.title}
        </h1>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={11} className="text-[#F50057] fill-[#F50057]" />
            ))}
          </div>
          <span className="text-gray-700 text-xs font-medium">4.9</span>
          <span className="text-gray-300 text-xs">|</span>
          <span className="text-gray-500 text-xs">2,042 reviews</span>
          <span className="text-gray-300 text-xs">|</span>
          <span className="text-[#F50057] text-xs">Sold by Store 7600</span>
        </div>

        {/* Wishlist */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setWishlist(!wishlist)}
            className="flex items-center gap-1.5 text-gray-500 text-xs"
          >
            <Heart
              size={14}
              className={wishlist ? 'fill-[#F50057] text-[#F50057]' : 'text-gray-400'}
            />
            <span>5k+ Add to Wishlist</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400 text-xs">
            <Share2 size={13} />
            Share
          </button>
        </div>

        {/* Store info */}
        <div className="flex items-center justify-between py-2.5 border-t border-b border-gray-100 mb-3">
          <button className="text-[#F50057] text-xs border border-[#F50057] px-3 py-1 rounded-full font-medium">
            Visit Store
          </button>
          <span className="text-xs text-gray-600 font-medium">Better Home Life - Official Store</span>
        </div>

        {/* Variants */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="mb-3">
            <p className="text-gray-700 text-xs font-semibold mb-2">الخيارات</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(i)}
                  disabled={!v.available}
                  className={`px-3 py-1.5 rounded-full text-xs border font-medium ${
                    i === selectedVariant
                      ? 'border-[#F50057] bg-pink-50 text-[#F50057]'
                      : 'border-gray-200 text-gray-500'
                  } ${!v.available ? 'opacity-40' : ''}`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="mb-4">
            <p className="text-gray-800 font-semibold text-sm mb-1.5">تفاصيل المنتج</p>
            <p className="text-gray-500 text-xs leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Shipping */}
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Truck size={13} className="text-[#F50057] shrink-0" />
            <span>شحن مجاني للطلبات فوق 200 AED</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <RotateCcw size={13} className="text-[#F50057] shrink-0" />
            <span>إرجاع مجاني خلال 14 يوماً</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Shield size={13} className="text-[#F50057] shrink-0" />
            <span>منتج أصلي 100%</span>
          </div>
        </div>
      </div>

      {/* Chat / Store bar */}
      <div className="fixed bottom-14 left-0 right-0 max-w-md mx-auto flex bg-white border-t border-gray-100 z-20">
        <button className="flex-1 flex flex-col items-center py-2 text-gray-500 text-[10px] gap-0.5">
          <MessageCircle size={19} />
          Chat
        </button>
        <div className="w-px bg-gray-100" />
        <button className="flex-1 flex flex-col items-center py-2 text-gray-500 text-[10px] gap-0.5">
          <Store size={19} />
          Store
        </button>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex bg-white border-t border-gray-100 z-20">
        <button
          disabled={!variant.available}
          className="flex-1 h-14 bg-[#F50057] text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
        >
          <ShoppingCart size={17} />
          Add to Cart 🔥
        </button>
        <button
          disabled={!variant.available}
          className="flex-1 h-14 bg-[#F57224] text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
        >
          Buy Now 📱
        </button>
      </div>
    </div>
  )
}
