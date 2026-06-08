'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  sold: number
  images: string[]
  description: string
}

export function ProductPageClient({ handle }: { handle: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    let isMounted = true
    
    const fetchProduct = async () => {
      try {
        if (!handle) {
          if (isMounted) {
            setLoading(false)
          }
          return
        }
        
        console.log('[v0] Fetching product:', handle)
        const response = await fetch(`/api/products/${handle}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        console.log('[v0] Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('[v0] Product data loaded:', data.name)
        
        if (isMounted) {
          setProduct(data)
          setMainImage(data.images?.[0] || '')
        }
      } catch (err) {
        console.error('[v0] Product fetch error:', err)
        if (isMounted) {
          setProduct(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()
    
    return () => {
      isMounted = false
    }
  }, [handle])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-600 mt-3">جاري تحميل المنتج...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-800 font-semibold mb-2">عذراً، المنتج غير متاح</p>
          <p className="text-gray-600 text-sm mb-4">قد يكون المنتج قد تم حذفه أو لم يعد متوفراً</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    )
  }

  const handleQuantity = (action: 'increment' | 'decrement') => {
    if (action === 'increment') {
      setQuantity(q => q + 1)
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Free Shipping Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-pulse justify-center gap-8 text-sm font-semibold">
          <span>🚚 شحن مجاني 100%</span>
          <span>📦 توصيل مضمون</span>
          <span>✨ جودة عالية</span>
          <span>🇸🇦 خدمة العملاء 24/7</span>
          <span>🚚 توصيل سريع</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-4 flex gap-2">
          <span>الرئيسية</span>
          <span className="text-[10px]">›</span>
          <span>أدوات التنظيف</span>
          <span className="text-[10px]">›</span>
          <span className="text-gray-600">{product.name}</span>
        </div>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Gallery */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto object-cover aspect-square"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800'
                }}
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {product.images?.slice(0, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`w-20 h-20 rounded-lg cursor-pointer object-cover transition-all border-2 ${
                    mainImage === img ? 'border-orange-500 shadow-md' : 'border-gray-200'
                  }`}
                  onClick={() => setMainImage(img)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100'
                  }}
                />
              ))}
              {product.images && product.images.length > 5 && (
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 border">
                  +{product.images.length - 5} أكثر
                </div>
              )}
            </div>

            {/* Buyer Gallery */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <span>📷 معرض المشترين ({product.reviews})</span>
              <span>•</span>
              <span>🎥 مع الصور والفيديو</span>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                🚚 شحن مجاني
              </span>
              <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
                🔥 متجر موثوق
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-500 text-sm">{product.description}</p>

            {/* Rating & Sold */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-xl">★★★★★</span>
                <span className="font-semibold ml-1">{product.rating || 4.9}</span>
                <span className="text-gray-400 text-sm ml-1">({product.reviews?.toLocaleString() || 0} تقييم)</span>
              </div>
              <div className="w-px h-5 bg-gray-300"></div>
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                📈 {product.sold?.toLocaleString() || 0} مباع
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 bg-gray-50 p-4 rounded-xl">
              <span className="text-3xl font-bold text-red-600">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg line-through text-gray-400">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md text-sm">
                    -{product.discount || 0}%
                  </span>
                </>
              )}
              <span className="ml-auto text-xs text-gray-500">🔥 عرض محدود الوقت</span>
            </div>

            {/* Shipping & Return */}
            <div className="bg-blue-50/40 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm">
                  <span className="font-medium">⚡ التوصيل السريع 48 ساعة</span>
                  <span className="text-gray-700"> - مضمون بحلول الثلاثاء</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                💎 احصل على مكافآت إذا تأخر التوصيل
              </div>
              <div className="flex items-center gap-2 text-sm">
                🔄 <strong>إرجاع مجاني خلال 7 أيام</strong>
              </div>
            </div>

            {/* Vouchers */}
            <div>
              <div className="font-semibold text-gray-700 flex items-center gap-2">🎟️ كوبونات</div>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="bg-white border border-dashed border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                  <span className="text-amber-500">💰</span>
                  <span className="font-mono font-bold">خصم 30 ريال</span>
                  <span className="text-xs text-gray-500">حد أدنى 49 ريال</span>
                  <button className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full font-medium hover:bg-gray-200">
                    احصل عليه
                  </button>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => handleQuantity('decrement')}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantity('increment')}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="flex flex-1 gap-3">
                <button className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-full shadow-md hover:bg-orange-600 transition flex items-center justify-center gap-2">
                  🛒 أضف للسلة
                </button>
                <button className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-full shadow-md hover:bg-red-700 transition flex items-center justify-center gap-2">
                  ⚡ اشتري الآن
                </button>
              </div>
              <button className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200">
                ♡
              </button>
            </div>

            {/* Store Info */}
            <div className="flex justify-between items-center border-t pt-5 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  SHOP
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    متجرنا الموثوق
                    <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1 rounded">⭐ موثوق</span>
                  </div>
                  <div className="text-xs text-gray-500">تقييم المتجر 98% • نشط منذ ساعة</div>
                  <div className="text-xs text-gray-400">📦 مبيعات عالية جداً</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-full text-sm bg-white hover:bg-gray-50">
                  💬 دردشة
                </button>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-black">
                  زيارة المتجر
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div className="mt-12">
          <div className="border-b border-gray-200 flex gap-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-1 text-base font-medium transition ${
                activeTab === 'details'
                  ? 'border-b-2 border-orange-500 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 تفاصيل المنتج
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-1 text-base font-medium transition ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-orange-500 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ⭐ التقييمات ({product.reviews})
            </button>
            <button
              onClick={() => setActiveTab('similar')}
              className={`py-3 px-1 text-base font-medium transition ${
                activeTab === 'similar'
                  ? 'border-b-2 border-orange-500 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🏷️ منتجات مشابهة
            </button>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="py-6 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold">🤖 ملخص ذكي</h3>
                <div className="bg-gray-50 p-4 rounded-xl mt-2 text-gray-700 border-l-4 border-orange-400 text-sm">
                  تم اختيار هذا المنتج بناءً على التقييمات الإيجابية من المشترين. يتمتع بتصميم خفيف الوزن وسهل الاستخدام وفعال جداً في التنظيف.
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <ul className="space-y-2 text-sm">
                    <li>✅ جودة ممتازة وتصميم حديث</li>
                    <li>✅ سهل الاستخدام والتنظيف</li>
                    <li>✅ متين وطويل الأمد</li>
                    <li>✅ توصيل سريع وآمن</li>
                    <li>✅ ضمان أصلي 100%</li>
                  </ul>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="font-semibold">📋 المواصفات</div>
                    <table className="w-full text-sm mt-2 space-y-1">
                      <tbody>
                        <tr className="border-b"><td className="py-1 text-gray-500">المادة</td><td className="text-right">جودة عالية</td></tr>
                        <tr className="border-b"><td className="py-1 text-gray-500">اللون</td><td className="text-right">متعدد</td></tr>
                        <tr className="border-b"><td className="py-1 text-gray-500">الحجم</td><td className="text-right">قياسي</td></tr>
                        <tr><td className="py-1 text-gray-500">الضمان</td><td className="text-right">12 شهر</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="py-6 space-y-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex flex-wrap gap-8 items-center border-b pb-4">
                  <div className="text-center">
                    <span className="text-5xl font-bold">{product.rating}</span>
                    <div className="text-yellow-400">★★★★★</div>
                    <span className="text-sm text-gray-500">{product.reviews?.toLocaleString() || 0} تقييم عام</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span>5★</span>
                      <div className="w-48 bg-gray-200 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full w-[88%]"></div></div>
                      <span>88%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>4★</span>
                      <div className="w-48 bg-gray-200 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full w-[8%]"></div></div>
                      <span>8%</span>
                    </div>
                  </div>
                </div>
                <button className="mt-5 w-full py-2 border rounded-xl text-gray-600 text-sm hover:bg-gray-50">
                  📖 شاهد جميع التقييمات →
                </button>
              </div>
            </div>
          )}

          {/* Similar Items Tab */}
          {activeTab === 'similar' && (
            <div className="py-6">
              <div className="text-center text-gray-600 py-8">
                منتجات مشابهة من المتجر
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
