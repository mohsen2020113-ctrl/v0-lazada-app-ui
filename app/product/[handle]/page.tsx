'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, Share2, ShoppingCart, Shield, RotateCcw, Truck, ChevronLeft, ChevronRight } from 'lucide-react'

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

export default function ProductPage({ params }: { params: { handle: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.handle}`)
      .then(r => r.json())
      .then(d => { setProduct(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.handle])

  if (loading) return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#F57224] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center gap-4" dir="rtl">
      <p className="text-white/60">المنتج غير موجود</p>
      <button onClick={() => router.back()} className="text-[#F57224] text-sm">العودة</button>
    </div>
  )

  const variant = product.variants?.[selectedVariant] || { price: product.price, available: true, title: '', id: product.id }
  const images = product.images?.length ? product.images : ['/placeholder.png']
  const hasVariants = (product.variants?.length ?? 0) > 1

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* AppBar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
          <ArrowRight size={18} className="text-white" />
        </button>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
            <Heart size={18} className="text-white" />
          </button>
          <button className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
            <Share2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[360px] bg-[#1A1A1A] overflow-hidden">
        <img
          src={images[currentImage]}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png' }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage(p => Math.max(0, p - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button
              onClick={() => setCurrentImage(p => Math.min(images.length - 1, p + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
            >
              <ChevronRight size={16} className="text-white" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-1.5 rounded-full transition-all ${i === currentImage ? 'w-5 bg-[#F57224]' : 'w-1.5 bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="rounded-t-3xl bg-[#0F0F0F] -mt-6 relative z-10 px-5 pt-5 pb-32">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-white font-bold text-lg leading-snug flex-1">{product.title}</h1>
          <div className="text-right shrink-0">
            <div className="text-[#F57224] font-extrabold text-2xl">{variant.price} AED</div>
            {variant.compareAtPrice && (
              <div className="text-white/30 text-sm line-through">{variant.compareAtPrice} AED</div>
            )}
          </div>
        </div>

        {hasVariants && (
          <div className="mb-4">
            <p className="text-white/50 text-xs font-bold tracking-wide mb-2.5">الخيارات</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    i === selectedVariant ? 'bg-[#F57224] text-white' : 'bg-[#1A1A1A] text-white/70 border border-white/10'
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <p className="text-white/50 text-xs font-bold tracking-wide">الكمية</p>
          <div className="flex items-center bg-[#1A1A1A] rounded-xl overflow-hidden">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-white/70">−</button>
            <span className="w-9 text-center text-white font-bold text-sm">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 flex items-center justify-center text-white/70">+</button>
          </div>
        </div>

        <div className="border-t border-white/5 mb-5" />

        {product.description && (
          <div className="mb-5">
            <p className="text-white font-bold text-sm mb-2">تفاصيل المنتج</p>
            <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <Truck size={14} className="text-[#F57224] shrink-0" />
            <span>شحن مجاني للطلبات فوق 200 AED</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <RotateCcw size={14} className="text-[#F57224] shrink-0" />
            <span>إرجاع مجاني خلال 14 يوماً</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <Shield size={14} className="text-[#F57224] shrink-0" />
            <span>منتج أصلي 100%</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] px-5 pt-3 pb-8">
        <button
          onClick={handleAddToCart}
          disabled={!variant.available}
          className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-colors ${
            !variant.available ? 'bg-white/10 text-white/40' : added ? 'bg-green-500 text-white' : 'bg-[#F57224] text-white'
          }`}
        >
          <ShoppingCart size={20} />
          {!variant.available ? 'نفد المخزون' : added ? 'تمت الإضافة ✓' : 'أضف إلى السلة'}
        </button>
      </div>
    </div>
  )
      }
