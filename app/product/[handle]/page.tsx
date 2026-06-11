'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Heart, Share2, ShoppingCart, Star, Shield, RotateCcw,
  Truck, Search, ChevronRight, ChevronLeft, Store,
  MessageCircle, Package, Award, ZoomIn
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

  useEffect(() => {
    if (!handle) return
    fetch(`/api/product/${handle}`)
      .then(r => r.json())
      .then(d => { setProduct(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [handle])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#F50057] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <Package size={48} className="text-gray-300" />
      <p className="text-gray-500 text-lg">المنتج غير موجود</p>
      <button onClick={() => router.back()} className="text-[#F50057] underline text-sm">العودة للتسوق</button>
    </div>
  )

  const variant = product.variants?.[selectedVariant] || { price: product.price, available: true, title: '', id: product.id }
  const images = product.images?.length ? product.images : ['/placeholder.png']
  const price = parseFloat(variant.price || '0')
  const comparePrice = parseFloat(variant.compareAtPrice || '0')
  const discount = variant.compareAtPrice && comparePrice > price
    ? Math.round((1 - price / comparePrice) * 100) : 0

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* ===== TOP HEADER ===== */}
      <header className="bg-[#F50057] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
          {/* Logo */}
          <button onClick={() => router.push('/')} className="text-white font-extrabold text-2xl tracking-tight shrink-0">
            4LEEE
          </button>
          {/* Search */}
          <div className="flex-1 flex items-center bg-white rounded-md overflow-hidden max-w-2xl">
            <input
              type="text"
              placeholder="ابحث في 4LEEE..."
              className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none"
            />
            <button className="bg-[#F50057] px-4 py-2 text-white hover:bg-[#c9004a] transition-colors">
              <Search size={18} />
            </button>
          </div>
          {/* Icons */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setWishlist(!wishlist)}
              className="flex flex-col items-center text-white text-[10px] gap-0.5"
            >
              <Heart size={20} className={wishlist ? 'fill-white' : ''} />
              <span>القائمة</span>
            </button>
            <button className="flex flex-col items-center text-white text-[10px] gap-0.5 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -left-1 bg-yellow-400 text-gray-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
              <span>السلة</span>
            </button>
            <button className="flex flex-col items-center text-white text-[10px] gap-0.5">
              <Store size={20} />
              <span>حسابي</span>
            </button>
          </div>
        </div>
        {/* Sub Nav */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 text-sm py-1.5 overflow-x-auto">
            {['الرئيسية', 'الإلكترونيات', 'الموضة', 'المنزل', 'الجمال', 'الرياضة', 'عروض اليوم', 'ماركات'].map(item => (
              <button key={item} className="text-gray-600 hover:text-[#F50057] whitespace-nowrap transition-colors font-medium">
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ===== BREADCRUMB ===== */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <button onClick={() => router.push('/')} className="hover:text-[#F50057]">الرئيسية</button>
          <ChevronLeft size={12} />
          <button className="hover:text-[#F50057]">الإلكترونيات</button>
          <ChevronLeft size={12} />
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-0">

            {/* ===== LEFT: IMAGE GALLERY ===== */}
            <div className="lg:w-[45%] p-6 border-l border-gray-100">
              {/* Main image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 group">
                <img
                  src={images[currentImage]}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow">
                    {discount}% خصم
                  </div>
                )}
                <button className="absolute top-4 left-4 bg-white/80 backdrop-blur p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={16} className="text-gray-700" />
                </button>
                {/* Prev/Next */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition-colors"
                    >
                      <ChevronRight size={18} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={18} className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${i === currentImage ? 'border-[#F50057] shadow-md scale-105' : 'border-gray-200 hover:border-pink-300'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {/* Share */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">مشاركة:</span>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#F50057] transition-colors border border-gray-200 px-3 py-1.5 rounded-full">
                  <Share2 size={13} /> مشاركة
                </button>
              </div>
            </div>

            {/* ===== RIGHT: PRODUCT INFO ===== */}
            <div className="lg:w-[55%] p-6 lg:p-8">

              {/* Title + wishlist */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-gray-900 font-bold text-xl leading-snug flex-1">{product.title}</h1>
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`p-2 rounded-full border-2 transition-all shrink-0 ${wishlist ? 'border-[#F50057] bg-pink-50 text-[#F50057]' : 'border-gray-200 text-gray-400 hover:border-pink-300'}`}
                >
                  <Heart size={18} className={wishlist ? 'fill-[#F50057]' : ''} />
                </button>
              </div>

              {/* Rating + sales */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className="text-[#F50057] fill-[#F50057]" />
                  ))}
                  <span className="text-[#F50057] font-bold text-sm mr-1">4.9</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm">2,042 تقييم</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm">5,000+ مبيعات</span>
              </div>

              {/* Price block */}
              <div className="bg-pink-50 rounded-xl px-5 py-4 mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-[#F50057] font-extrabold text-3xl">{price.toFixed(2)}</span>
                  <span className="text-[#F50057] font-semibold text-lg">AED</span>
                  {variant.compareAtPrice && comparePrice > price && (
                    <span className="text-gray-400 text-base line-through">{comparePrice.toFixed(2)} AED</span>
                  )}
                  {discount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      وفّر {discount}%
                    </span>
                  )}
                </div>
                <p className="text-green-600 text-xs mt-1.5 font-medium">✓ السعر شامل ضريبة القيمة المضافة</p>
              </div>

              {/* Store info */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">يباع بواسطة</p>
                  <p className="text-sm font-semibold text-gray-800">Better Home Life - Official Store</p>
                  <p className="text-xs text-[#F50057]">Store 7600 • متجر رسمي ✓</p>
                </div>
                <button className="text-[#F50057] text-sm border border-[#F50057] px-4 py-1.5 rounded-full font-medium hover:bg-pink-50 transition-colors whitespace-nowrap">
                  زيارة المتجر
                </button>
              </div>

              {/* Variants */}
              {(product.variants?.length ?? 0) > 1 && (
                <div className="mb-5">
                  <p className="text-gray-700 text-sm font-semibold mb-2">الخيار المتاح:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(i)}
                        disabled={!v.available}
                        className={`px-4 py-2 rounded-lg text-sm border-2 font-medium transition-all ${
                          i === selectedVariant
                            ? 'border-[#F50057] bg-pink-50 text-[#F50057]'
                            : 'border-gray-200 text-gray-600 hover:border-pink-300'
                        } ${!v.available ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700">الكمية:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg transition-colors"
                  >−</button>
                  <span className="px-5 py-2 font-bold text-gray-800 text-base min-w-[48px] text-center border-x-2 border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg transition-colors"
                  >+</button>
                </div>
                <span className="text-xs text-green-600 font-medium">
                  {variant.available ? '✓ متوفر في المخزون' : '✗ نفد المخزون'}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!variant.available}
                  className={`flex-1 h-13 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                    !variant.available
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : addedToCart
                      ? 'bg-green-500 text-white shadow-green-200'
                      : 'bg-[#F50057] text-white hover:bg-[#c9004a] shadow-pink-200 hover:shadow-pink-300'
                  }`}
                >
                  <ShoppingCart size={20} />
                  {addedToCart ? '✓ تمت الإضافة!' : 'أضف إلى السلة 🔥'}
                </button>
                <button
                  disabled={!variant.available}
                  className="flex-1 py-3.5 rounded-xl font-bold text-base bg-[#F57224] text-white hover:bg-[#d45f1a] transition-all shadow-md shadow-orange-200 hover:shadow-orange-300 flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  اشتري الآن 📱
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-3 gap-1.5">
                  <Truck size={22} className="text-[#F50057]" />
                  <span className="text-xs text-gray-600 font-medium leading-tight">شحن مجاني<br/>فوق 200 AED</span>
                </div>
                <div className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-3 gap-1.5">
                  <RotateCcw size={22} className="text-[#F50057]" />
                  <span className="text-xs text-gray-600 font-medium leading-tight">إرجاع مجاني<br/>خلال 14 يوم</span>
                </div>
                <div className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-3 gap-1.5">
                  <Shield size={22} className="text-[#F50057]" />
                  <span className="text-xs text-gray-600 font-medium leading-tight">منتج أصلي<br/>100% مضمون</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== TABS: Description / Reviews / Shipping ===== */}
          <div className="border-t border-gray-100">
            <div className="flex border-b border-gray-100">
              {(['description', 'reviews', 'shipping'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? 'text-[#F50057] border-b-2 border-[#F50057]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'description' ? 'تفاصيل المنتج' : tab === 'reviews' ? 'التقييمات (2,042)' : 'الشحن والإرجاع'}
                </button>
              ))}
            </div>
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="max-w-3xl">
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-[#F50057]">4.9</div>
                      <div className="flex gap-0.5 mt-1 justify-center">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#F50057] text-[#F50057]" />)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">2,042 تقييم</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5,4,3,2,1].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-4">{s}</span>
                          <Star size={10} className="fill-[#F50057] text-[#F50057]" />
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#F50057] rounded-full" style={{width: ['85%','8%','4%','2%','1%'][i]}} />
                          </div>
                          <span className="text-xs text-gray-400">{['1,735','163','82','41','21'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="max-w-2xl space-y-4">
                  {[
                    { icon: Truck, title: 'شحن مجاني', desc: 'للطلبات فوق 200 درهم إماراتي. التسليم خلال 3-5 أيام عمل.' },
                    { icon: RotateCcw, title: 'سياسة الإرجاع', desc: 'يمكن إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام إذا كان في حالته الأصلية.' },
                    { icon: Shield, title: 'ضمان الأصالة', desc: 'نضمن أن جميع المنتجات أصلية 100%. في حالة أي مشكلة، نسترجع المبلغ كاملاً.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                      <Icon size={24} className="text-[#F50057] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">{title}</p>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== CHAT SUPPORT BANNER ===== */}
        <div className="mt-4 bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F50057] rounded-full flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">هل لديك سؤال؟</p>
              <p className="text-xs text-gray-500">تواصل مع خدمة العملاء أو البائع مباشرة</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-sm border border-[#F50057] text-[#F50057] px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors font-medium">
              <MessageCircle size={14} className="inline ml-1" />
              الدردشة
            </button>
            <button className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Store size={14} className="inline ml-1" />
              زيارة المتجر
            </button>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#F50057] font-bold text-xl mb-2">4LEEE</p>
          <p className="text-sm">التسوق الأفضل من 260 دولة حول العالم</p>
        </div>
      </footer>
    </div>
  )
}
