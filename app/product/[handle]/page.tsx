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
  { id: 1, name: 'أحمد محمد', rating: 5, date: 'منذ 3 أيام', comment: 'منتج ممتاز جداً، الجودة ر��ئعة وسريع الشحن. أنصح به بشدة.', helpful: 24, verified: true, avatar: 'أ' },
  { id: 2, name: 'سارة علي', rating: 5, date: 'منذ أسبوع', comment: 'وصل بشكل سريع والتغليف كان ممتازاً. المنتج يطابق الوصف تماماً.', helpful: 18, verified: true, avatar: 'س' },
  { id: 3, name: 'محمد خالد', rating: 4, date: 'منذ أسبوعين', comment: 'منتج جيد لكن التوصيل تأخر قليلاً. الجودة مقبولة بهذا السعر.', helpful: 12, verified: true, avatar: 'م' },
  { id: 4, name: 'فاطمة حسن', rating: 5, date: 'منذ شهر', comment: 'أفضل منتج اشتريته من هذا المتجر! سأشتري مجدداً بالتأكي��.', helpful: 31, verified: true, avatar: 'ف' },
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
        <p className="text-gray-500 text-sm">جارٍ تحميل المنتج...</p>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4" dir="rtl">
      <p className="text-gray-500">المنتج غير موجود</p>
      <button onClick={() => router.push('/')} className="bg-[#F50057] text-white px-6 py-2 rounded-lg text-sm">
        العودة للرئيسية
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
              placeholder="ابحث في 4LEEE..."
              className="w-full pr-9 pl-4 py-2.5 rounded-lg text-sm bg-white text-gray-800 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setWishlist(!wishlist)}
              className="flex flex-col items-center gap-0.5"
            >
              <Heart size={22} className={wishlist ? 'text-yellow-300 fill-yellow-300' : 'text-white'} />
              <span className="text-white text-[10px]">القائمة</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 relative">
              <div className="relative">
                <ShoppingCart size={22} className="text-white" />
                <span className="absolute -top-1 -left-1 bg-yellow-400 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
              </div>
              <span className="text-white text-[10px]">السلة</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold">م</span>
              </div>
              <span className="text-white text-[10px]">حسابي</span>
            </button>
          </div>
        </div>
        {/* Sub-nav */}
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2 overflow-x-auto scrollbar-hide text-sm text-white/90">
            {['الرئيسية', 'الإلكترونيات', 'الموضة', 'المنزل', 'الجمال', 'الرياضة', 'عروض اليوم', 'ماركات'].map((cat, i) => (
              <button key={i} className="whitespace-nowrap hover:text-white transition-colors">{cat}</button>
            ))}
          </div>
        </div>
      </header>

      {/* ===== BREADCRUMBS ===== */}
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <button className="hover:text-[#F50057] transition-colors">الرئيسية</button>
          <ChevronLeft size={12} />
          <button className="hover:text-[#F50057] transition-colors">الإلكترونيات</button>
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
                <span>مشاركة:</span>
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#F50057] transition-colors">
                  <Share2 size={16} />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>

            {/* RIGHT: Info */}
            <div className="lg:w#[55%] p-6 flex flex-col gap-4">
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
                <button className="text-[#F50057] text-sm hover:underline">2,042 تقييم</button>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <TrendingUp size={14} className="text-green-500" />
                  +5,000 مبيعاً
                </span>
              </div>

              {/* Price Block */}
              <div className="bg-gradient-to-l from-red-50 to-pink-50 rounded-xl p-4 border border-pink-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#F50057]">
                    {variant.price} <span className="text-lg">د.إ</span>
                  </span>
                  {variant.compareAtPrice && (
                    <span className="text-gray-400 line-through text-base">{variant.compareAtPrice} د.إ</span>
                  )}
                  {discount > 0 && (
                    <span className="bg-[#F50057] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                      وفّر {discount}%
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  السعر شامل ضريبة القيمة المضافة
                </p>
              </div>

              {/* Store Info */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="text-gray-500 text-xs mb-2">يباع بواسطة</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#F50057] rounded-lg flex items-center justify-center">
                      <Store size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Better Home Life - Official Store</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">Store 7600</span>
                        <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">متجر رسمي</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-xs text-[#F50057] border border-[#F50057] px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium">
                    زيارة المتجر
                  </button>
                </div>
              </div>

              {/* Variants */}
              {hasVariants && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">الخيارات المتاحة</p>
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
                  <p className="text-sm font-semibold text-gray-700 mb-2">الكمية</p>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 bg-gray-50 text-gray-700 text-lg hover:bg-gray-100 transition-colors font-bold"
                    >
                      −
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
                  متوفر في المخزون
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
                  {!variant.available ? 'نفد المخزون' : addedToCart ? 'تمت الإظافة ✓' : 'أضف إلى السلة 🛒'}
                </button>
                <button
                  disabled={!variant.available}
                  className="flex-1 py-3.5 rounded-xl font-bold text-base bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all shadow-sm disabled:opacity-40"
                >
                  اشتري الآن ⚡
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: <Truck size={18} className="text-[#F50057]" />, title: 'شحن مجاني', sub: 'فوق 200 درهم' },
                  { icon: <RotateCcw size={18} className="text-[#F50057]" />, title: 'إرجاع مجاني', sub: 'خلال 14 يوم' },
                  { icon: <Shield size={18} className="text-[#F50057]" />, title: 'منتج أصلي', sub: '100% مضمون' },
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
              { key: 'description', label: 'تفاصيل المنتج' },
              { key: 'reviews', label: `التقييمات (2,042)` },
              { key: 'shipping', label: 'الشحن والإرجاع' },
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
                {product.description || 'لا يوجد وصف متاح لهذا المنتج.'}
              </div>
            )}
            {activeTab === 'reviews' && (
              <p className="text-gray-500 text-sm text-center py-4">اطّلع على التقييمات التفصيلية أدناه</p>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <Truck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">شحن مجاني</p>
                    <p className="text-blue-700 mt-1">للطلبات التي تتجاوز 200 درهم إماراتي. التوصيل خلال 3-5 أيام عمل.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <RotateCcw size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">سياسة الإرجاع</p>
                    <p className="text-green-700 mt-1">إرجاع مجاني خلال 14 يوماً من استلام المنتج بشرط أن يكون بحالته الأصلية.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <Shield size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-900">ضمان الأصالة</p>
                    <p className="text-purple-700 mt-1">جميع منتجاتنا أصلية 100% مضمونة. نعمل مع موردين معتمدين فقط.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
�&V�FVE&�GV7G2���'�����'WGF���W�׷'�GТ��6Ɩ6�ײ����&�WFW"�W6���&�GV7B�G�'��F�W��Т6�74��S�&w&�WFW�B�&�v�B��fW#�6�F�r��BG&�6�F����6�F�r&�V�FVB׆��fW&f��rֆ�FFV�&�&FW"&�&FW"�w&�� ���F�b6�74��S�&7V7B�7V&R&r�w&��S�fW&f��rֆ�FFV�#��'��vR���Ɩ�p�7&3׷'��vWТ�C׷'�F�F�WТ6�74��S�'r�gV����gV���&�V7B�6�fW"w&�Wֆ�fW#�66�R�RG&�6�F����G&�6f�&� ��������F�b6�74��S�'r�gV����gV��f�W��FV�2�6V�FW"�W7F�g��6V�FW"#��6�vR6��S׳#��6�74��S�'FW�B�w&��3"����F�c��Т��F�c��F�b6�74��S�'�"#��6�74��S�'FW�Bׇ2FW�B�w&��sf��B��VF�V�Ɩ�R�6���"�VF��r�B�"�#�'�F�F�W�����6�74��S�'FW�B�6�f��B�&��BFW�Bղ4cSSu�#�'�&�6W�
���S����F�b6�74��S�&f�W��FV�2�6V�FW"v��R�B�#����"�2�B�U����2���7F"�W�׷7�6��S׳�6�74��S�&f���זV���r�CFW�BזV���r�C"��Т��F�c���F�c���'WGF�����Т��F�c���F�c���F�c��Р��������DUD��TB$Ud�Uu2�������Т�F�b6�74��S�&���r�w��ׂ�WF���B"�B#��F�b6�74��S�&&r�v��FR&�V�FVB׆�6�F�r�6��b#�ƃ"6�74��S�'FW�B��rf��B�&��BFW�B�w&�ӓf�W��FV�2�6V�FW"v�"�"�b#��7F"6��S׳#�6�74��S�&f���זV���r�CFW�BזV���r�C"��
���-�����]�}��
�}�M���]�M�}�����#��F�b6�74��S�&f�W�f�W��6���s�f�W��&�rvӂ#���&F��r7V��'���Т�F�b6�74��S�&�s�r�cBf�W��6�&���#��F�b6�74��S�'FW�B�6V�FW"�"�B#��F�b6�74��S�'FW�B�g��f��B�&�6�FW�B�w&�ӓ#�B���F�c��F�b6�74��S�&f�W��FV�2�6V�FW"�W7F�g��6V�FW"v�ג�"#����"�2�B�U����2���7F"�W�׷7�6��S׳#�6�74��S�&f���זV���r�CFW�BזV���r�C"��Т��F�c��6�74��S�'FW�B�w&��SFW�B�6�#튍�m�}���
���M��"�C"
���-�����S�����F�c��F�b6�74��S�'76Rג�"#��&F��t'&V�F�v����"�����F�b�W�׷"�7F'7�6�74��S�&f�W��FV�2�6V�FW"v�"#��7�6�74��S�'FW�Bׇ2FW�B�w&��cr�FW�B��VgB#�"�7F'7�)�S��7���F�b6�74��S�&f�W��&r�w&��&�V�FVB�gV����"�fW&f��rֆ�FFV�#��F�`�6�74��S�&��gV��&rזV���r�C&�V�FVB�gV�� �7G��S׷�v�GF��G�"�7G�V�Т����F�c��7�6�74��S�'FW�Bׇ2FW�B�w&��Srӂ#�"�7G�S��7����F�c���Т��F�c��F�b6�74��S�&�B�bB�B&�&FW"�B&�&FW"�w&��#��F�b6�74��S�&w&�Bw&�B�6��2�"v�"FW�B�6V�FW"#��F�b6�74��S�&&r�w&VV��S&�V�FVB��r�"#��6�74��S�'FW�B׆�f��B�&��BFW�B�w&VV��c#㓂S����6�74��S�'FW�Bׇ2FW�B�w&��S#��}�m���b
���b
�}�M�]�m���������F�c��F�b6�74��S�&&r�&�VR�S&�V�FVB��r�"#��6�74��S�'FW�B׆�f��B�&��BFW�B�&�VR�c#�RS����6�74��S�'FW�Bׇ2FW�B�w&��S#�=���M������b
�]�͊����}�������F�c���F�c���F�c���F�cࠢ��&Wf�Ww2Ɨ7B��Т�F�b6�74��S�&f�W��#��F�b6�74��S�&f�W��FV�2�6V�FW"�W7F�g��&WGvVV��"�B#��6�74��S�'FW�B�6�FW�B�w&��c#�6�'FVE&Wf�Ww2��V�wF��
���-�����R
�]������c����6V�V7@�f�VS׷&Wf�Wu6�'D'�Т��6��vS׶R��6WE&Wf�Wu6�'D'��R�F&vWB�f�VR2璗Т6�74��S�'FW�B�6�&�&FW"&�&FW"�w&��#&�V�FVB��r��2���R�WFƖ�R����RFW�B�w&��s ����F���f�VS�&�WvW7B#�}�M�=�݊������F������F���f�VS�&�V�gV�#�}�M�=�=���
��}�m�������F������6V�V7C���F�c��F�b6�74��S�'76Rג�B#��6�'FVE&Wf�Ww2���&Wf�Wr�����F�b�W�׷&Wf�Wr�G�6�74��S�&&�&FW"&�&FW"�w&��&�V�FVB׆��B#��F�b6�74��S�&f�W��FV�2�7F'Bv�2#��F�b6�74��S�'r���&�V�FVB�gV��&rղ4cSSu�f�W��FV�2�6V�FW"�W7F�g��6V�FW"FW�B�v��FRf��B�&��Bf�W��6�&���#��&Wf�Wr�fF'Т��F�c��F�b6�74��S�&f�W��#��F�b6�74��S�&f�W��FV�2�6V�FW"�W7F�g��&WGvVV�f�W��w&v�"#��F�c��6�74��S�&f��B�6V֖&��BFW�B�w&�ӃFW�B�6�#�&Wf�Wr���W�����F�b6�74��S�&f�W��FV�2�6V�FW"v�"�B��R#��F�b6�74��S�&f�W��FV�2�6V�FW"v��R#����"�2�B�U����2�����7F"�W�׷7�6��S׳'�6�74��S׷2��&Wf�Wr�&F��r�vf���זV���r�CFW�BזV���r�Cr�wFW�B�w&��#f����w&��#w�����Т��F�c��&Wf�Wr�fW&�f�VBbb���7�6�74��S�'FW�Bׇ2FW�B�w&VV��cf�W��FV�2�6V�FW"v��R#��6�V6�6�&6�R6��S׳���
�]�M�����
�]������ ���7���Т��F�c���F�c��7�6�74��S�'FW�Bׇ2FW�B�w&��C#�&Wf�Wr�FFW���7����F�c��6�74��S�'FW�B�6�FW�B�w&��s�B�"�VF��r�b#�&Wf�Wr�6���V�G�����'WGF����6Ɩ6�ײ������6��7B�W�B��Wr6WB��V�gV�f�FW2���b��W�B�2�&Wf�Wr�B���W�B�FV�WFR�&Wf�Wr�B��V�6R�W�B�FB�&Wf�Wr�B��6WD�V�gV�f�FW2��W�B���Т6�74��S׶f�W��FV�2�6V�FW"v��R�B�2FW�Bׇ2G&�6�F����6���'2G���V�gV�f�FW2�2�&Wf�Wr�B��wFW�Bղ4cSSu�r�wFW�B�w&��C��fW#�FW�B�w&��cp��Т��F�V�'5W6��S׳'���
�]�������&Wf�Wr�V�gV����V�gV�f�FW2�2�&Wf�Wr�B����Ґ���'WGF�����F�c���F�c���F�c���Т��F�c��'WGF��6�74��S�'r�gV���B�B��2&�&FW"�"&�&FW"�F6�VB&�&FW"�w&��#&�V�FVB׆�FW�B�6�FW�B�w&��S��fW#�&�&FW"ղ4cSSu���fW#�FW�Bղ4cSSu�G&�6�F����6���'2f��B��VF�V�#�
����b
�͘]����
�}�M���-�����]�}���"�C"����'WGF�����F�c���F�c���F�c���F�cࠢ�������$T4T�DŒd�UtTB�������Т�&V6V�FǕf�WvVB��V�wF��bb���F�b6�74��S�&���r�w��ׂ�WF���B"�B#��F�b6�74��S�&&r�v��FR&�V�FVB׆�6�F�r�6��b#�ƃ"6�74��S�'FW�B��rf��B�&��BFW�B�w&�ӓf�W��FV�2�6V�FW"v�"�"�B#��6��6�6��S׳#�6�74��S�'FW�B�w&��S"��
�M�}�}�����}�r
�]�M���}������#��F�b6�74��S�&w&�Bw&�B�6��2�"6Ӧw&�B�6��2�2�C�w&�B�6��2�B�s�w&�B�6��2�bv�2#��&V6V�FǕf�WvVB���'�����'WGF���W�׷'�GТ��6Ɩ6�ײ����&�WFW"�W6���&�GV7B�G�'��F�W��Т6�74��S�&w&�WFW�B�&�v�B��fW#�6�F�r��BG&�6�F����6�F�r&�V�FVB׆��fW&f��rֆ�FFV�&�&FW"&�&FW"�w&�� ���F�b6�74��S�&7V7B�7V&R&r�w&��S�fW&f��rֆ�FFV�#��'��vR���Ɩ�r7&3׷'��vW��C׷'�F�F�W�6�74��S�'r�gV����gV���&�V7B�6�fW"w&�Wֆ�fW#�66�R�RG&�6�F����G&�6f�&�"�������F�b6�74��S�'r�gV����gV��f�W��FV�2�6V�FW"�W7F�g��6V�FW"#��6�vR6��S׳#��6�74��S�'FW�B�w&��3"����F�c��Т��F�c��F�b6�74��S�'�"#��6�74��S�'FW�Bׇ2FW�B�w&��sf��B��VF�V�Ɩ�R�6���"�VF��r�B�"�#�'�F�F�W�����6�74��S�'FW�B�6�f��B�&��BFW�Bղ4cSSu�#�'�&�6W�
���S�����F�c���'WGF�����Т��F�c���F�c���F�c��Р��������4�B5U�%B$��U"�������Т�F�b6�74��S�&���r�w��ׂ�WF���B"�B#��F�b6�74��S�&&r�w&F�V�B�F���g&������SF��&VB�S&�&FW"&�&FW"����&�V�FVB׆��Rf�W��FV�2�6V�FW"�W7F�g��&WGvVV�f�W��w&v�B#��F�b6�74��S�&f�W��FV�2�6V�FW"v�2#��F�b6�74��S�'r�"��"&rղ4cSSu�&�V�FVB�gV��f�W��FV�2�6V�FW"�W7F�g��6V�FW"#���W76vT6�&6�R6��S׳#'�6�74��S�'FW�B�v��FR"����F�c��F�c��6�74��S�&f��B�&��BFW�B�w&�Ӄ#�}�B
�M�����2
�=�M�}�M������6�74��S�'FW�B�w&��SFW�B�6�#튭���}�]�B
�]��
����]��
�}�M���]�M�}�
�=��
�}�M���}�m��
�]���}�M��������F�c���F�c��F�b6�74��S�&f�W�v�2#��'WGF��6�74��S�&&rղ4cSSu�FW�B�v��FR��R��"�R&�V�FVB׆�FW�B�6�f��B�6V֖&��B��fW#�&rղ6CCFE�G&�6�F����6���'2f�W��FV�2�6V�FW"v�"#���W76vT6�&6�R6��S׳g���
�}�M������M�����'WGF����'WGF��6�74��S�&&�&FW"�"&�&FW"ղ4cSSu�FW�Bղ4cSSu���R��"�R&�V�FVB׆�FW�B�6�f��B�6V֖&��B��fW#�&r�&VB�SG&�6�F����6���'2f�W��FV�2�6V�FW"v�"#��7F�&R6��S׳g���
�-���}���
�}�M�]���͋���'WGF�����F�c���F�c���F�cࠢ�������d��DU"�������Т�f��FW"6�74��S�&&r�w&�ӓFW�B�v��FR�B�B#��F�b6�74��S�&���r�w��ׂ�WF���B��#��F�b6�74��S�&w&�Bw&�B�6��2�"�C�w&�B�6��2�Bvӂ�"ӂ#��F�c�ƃ26�74��S�'FW�B׆�f��B�&�6�FW�Bղ4cSSu��"�2#�D�TTS���3��6�74��S�'FW�B�w&��CFW�B�6�#�}�M���=���"
�}�M�=��m�B
�]�b#c
�����M��
�ݘ��B
�}�M���}�M�S�����F�c��F�c�ƃB6�74��S�&f��B�6V֖&��BFW�B�6��"�2#�]�=�}���������C���}��������
�}�M����r�}�=���}�=��
�}�M�]��͊}��r�}�}��"
�}�M�����r�}�}���]�B
���m�ru�����������W�׶��6�74��S�'FW�B�w&��CFW�B�6��"�"7W'6�"����FW"��fW#�FW�B�v��FRG&�6�F����6���'2#��������Т��F�c��F�c�ƃB6�74��S�&f��B�6V֖&��BFW�B�6��"�2#�}�M���}�m�����c���C���}������
���M��D�TTRr�}���M���B
�}�M���}�m��r�}�]��=�"
�}�M���}�m��u�����������W�׶��6�74��S�'FW�B�w&��CFW�B�6��"�"7W'6�"����FW"��fW#�FW�B�v��FRG&�6�F����6���'2#��������Т��F�c��F�c�ƃB6�74��S�&f��B�6V֖&��BFW�B�6��"�2#튭�}�����m�s���C���t��7Fw&�r�uGv�GFW"r�uF��F��r�u��UGV&Ru�����������W�׶��6�74��S�'FW�B�w&��CFW�B�6��"�"7W'6�"����FW"��fW#�FW�B�v��FRG&�6�F����6���'2#��������Т��F�c���F�c��F�b6�74��S�&&�&FW"�B&�&FW"�w&�ӃB�bFW�B�6V�FW"FW�B�w&��SFW�Bׇ2#�*�##BD�TTR�
�͘]����
�}�M�ݘ-���"
�]�ݘ���������F�c���F�c���f��FW#���F�c����
