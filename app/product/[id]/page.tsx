'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Heart, Share2, Star, Truck, RotateCcw, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { products, Product } from '@/lib/data/products'

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const cartStore = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const foundProduct = products.find(p => p.id === params.id)
    setProduct(foundProduct || null)
    if (foundProduct) {
      setSelectedColor(foundProduct.colors[0])
      setSelectedSize(foundProduct.sizes[0])
    }
  }, [params.id])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center dir-rtl" dir="rtl">
        <div className="text-center">
          <p className="text-xl mb-4">المنتج غير موجود</p>
          <button onClick={() => router.back()} className="bg-orange-500 px-6 py-2 rounded-lg">
            العودة
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    cartStore.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      color: selectedColor,
      size: selectedSize,
      sellerName: product.seller.name,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white dir-rtl" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-800 rounded-lg">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">تفاصيل المنتج</h1>
        <button className="p-2 hover:bg-gray-800 rounded-lg">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Image Gallery */}
        <div className="mb-6">
          <div className="bg-gray-800 aspect-square rounded-lg overflow-hidden mb-4 flex items-center justify-center">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  selectedImage === idx ? 'border-orange-500' : 'border-gray-700'
                }`}
              >
                <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-6">
          {product.isNew && (
            <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs mb-3 font-bold">
              جديد
            </span>
          )}
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {product.rating} ({product.reviews} تقييم) • {product.sold.toLocaleString()} مبيعة
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-orange-500">{product.price.toFixed(0)} AED</span>
            <span className="text-lg text-gray-500 line-through">{product.originalPrice.toFixed(0)} AED</span>
            <span className="bg-red-500 px-2 py-1 rounded text-sm font-bold">{product.discount}%</span>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{product.seller.name}</span>
              <span className="text-sm text-yellow-400">★ {product.seller.rating}</span>
            </div>
            <p className="text-sm text-gray-400">{product.seller.totalSales.toLocaleString()} مبيعة</p>
          </div>

          {/* Shipping */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-800 p-3 rounded-lg flex items-start gap-2">
              <Truck className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">شحن {product.shipping.free ? 'مجاني' : 'مدفوع'}</p>
                <p className="text-gray-400">يصل في {product.shipping.days} أيام</p>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg flex items-start gap-2">
              <RotateCcw className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">إرجاع 15 يوم</p>
                <p className="text-gray-400">مضمون</p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Selection */}
        {product.colors.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-bold mb-3">اختر اللون:</label>
            <div className="flex gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    selectedColor === color
                      ? 'border-orange-500 bg-gray-800'
                      : 'border-gray-700 bg-gray-900'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {product.sizes.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-bold mb-3">اختر الحجم:</label>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 rounded-lg border-2 transition ${
                    selectedSize === size
                      ? 'border-orange-500 bg-gray-800'
                      : 'border-gray-700 bg-gray-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-3">الكمية:</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              -
            </button>
            <span className="text-lg font-bold min-w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6 sticky bottom-0 bg-gray-950 py-4">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition ${
              isFavorite
                ? 'border-red-500 bg-red-500 text-white'
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-red-500'
            }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'مضاف' : 'إضافة'}
          </button>
          <button
            onClick={handleAddToCart}
            className="py-3 rounded-lg bg-orange-500 hover:bg-orange-600 font-bold flex items-center justify-center gap-2 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {addedToCart ? '✓ تمت الإضافة' : 'أضف للسلة'}
          </button>
        </div>

        {/* Description & Specs */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h2 className="text-lg font-bold mb-3">الوصف</h2>
            <p className="text-gray-400">{product.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3">المواصفات</h2>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center border-b border-gray-700 last:border-b-0">
                  <div className="w-1/3 bg-gray-900 px-4 py-3 font-semibold text-sm">{key}</div>
                  <div className="w-2/3 px-4 py-3 text-gray-300">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3">التقييمات</h2>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">مستخدم #{i}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">تقييم وهمي رائع جداً للمنتج ⭐</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
