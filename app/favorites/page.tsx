'use client'

import { Heart, Share2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const mockProducts = Array(8).fill(null).map((_, i) => ({ id: i + 1, name: `Product ${i + 1}`, price: 30 + Math.random() * 100, originalPrice: 100 + Math.random() * 200, discount: Math.floor(20 + Math.random() * 40), image: `https://via.placeholder.com/200x200?text=Product${i + 1}` }))

export default function FavoritesPage() {
  const [items, setItems] = useState(mockProducts)

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">My Favorites ({items.length})</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative"><img src={product.image} alt={product.name} className="w-full aspect-square object-cover hover:scale-105 transition-transform" />{product.discount > 0 && <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded font-bold text-sm">-{product.discount}%</div>}<button onClick={() => removeItem(product.id)} className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"><Heart className="w-5 h-5 fill-pink-600 text-pink-600" /></button></div>
                <div className="p-3"><Link href={`/product/${product.id}`} className="block"><p className="font-bold text-gray-900 line-clamp-2 text-sm mb-2 hover:text-pink-600 transition-colors">{product.name}</p></Link><div className="flex items-center gap-2 mb-3"><span className="text-lg font-bold text-pink-600">฿{product.price.toFixed(2)}</span>{product.originalPrice > product.price && <span className="text-sm text-gray-500 line-through">฿{product.originalPrice.toFixed(2)}</span>}</div><div className="flex gap-2"><Link href={`/product/${product.id}`} className="flex-1 bg-pink-600 text-white py-2 rounded font-bold hover:bg-pink-700 transition-colors text-center text-sm">View</Link><button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"><Share2 className="w-4 h-4" /></button></div></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20"><Heart className="w-16 h-16 text-gray-300 mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-2">No favorite items yet</h2><p className="text-gray-600 mb-6">Add items to your favorites to keep track of them</p><Link href="/" className="px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors">Start Shopping</Link></div>
        )}
      </div>
=======
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">المفضلة</h1>
        {items.length > 0 && (
          <span className="mr-auto bg-[#C2185B]/20 text-[#C2185B] text-xs font-bold px-2.5 py-1 rounded-full">
            {items.length} منتج
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-24 h-24 rounded-full bg-[#C2185B]/10 flex items-center justify-center mb-5">
            <Heart size={48} className="text-[#C2185B]" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">قائمتك فارغة</h2>
          <p className="text-white/40 text-sm mb-7">أضف المنتجات التي تعجبك إلى المفضلة</p>
          <Link href="/" className="bg-[#C2185B] text-white font-bold px-8 py-3.5 rounded-2xl">
            استكشف المنتجات
          </Link>
        </div>
      ) : (
        <div className="px-4 pb-24 space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-[#1A1A1A] rounded-2xl p-3 flex gap-3">
              <div className="w-20 h-20 rounded-xl bg-[#2A2A2A] flex items-center justify-center shrink-0">
                <span className="text-4xl">{item.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold line-clamp-2 mb-1">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[#C2185B] font-black text-base">{item.price} AED</span>
                  <span className="text-white/30 text-xs line-through">{item.original} AED</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end justify-between shrink-0">
                <button onClick={() => remove(item.id)} className="text-white/20 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
                <button className="w-8 h-8 rounded-xl bg-[#C2185B] flex items-center justify-center">
                  <ShoppingCart size={14} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
    </div>
  )
}
