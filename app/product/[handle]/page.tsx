'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, Share2, ShoppingCart, Shield, RotateCcw, Truck } from 'lucide-react'
import { ImageGallery } from '@/components/image-gallery'
import { VariantChips } from '@/components/variant-chips'
import { QuantitySelector } from '@/components/quantity-selector'
import { Reviews } from '@/components/reviews'

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
      <ImageGallery
        images={images}
        alt={product.title}
        onImageChange={setCurrentImage}
      />

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
          <VariantChips
            variants={product.variants.map((v, i) => ({
              ...v,
              available: v.available !== false,
            }))}
            selectedIndex={selectedVariant}
            onSelect={setSelectedVariant}
            label="الخيارات"
          />
        )}

        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          min={1}
          max={999}
          label="الكمية"
        />

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

        {/* Reviews Section */}
        <div className="mt-8 -mx-5">
          <Reviews productId={product.id} />
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
