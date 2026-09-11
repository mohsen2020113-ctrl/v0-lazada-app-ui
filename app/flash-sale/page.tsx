'use client'

import { Heart, Flame } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const products = Array(8).fill(null).map((_, i) => ({ id: i + 1, name: `Flash Sale Product ${i + 1}`, price: 30 + i * 10, originalPrice: 100 + i * 20, discount: 58, image: `https://via.placeholder.com/200x200?text=Product${i + 1}` }))

export default function FlashSalePage() {
  const [favorites, setFavorites] = useState<number[]>([])
  return <main className="min-h-screen bg-gray-50"><header className="sticky top-0 z-40 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-6"><div className="max-w-7xl mx-auto flex items-center justify-between"><div className="flex items-center gap-3"><Flame className="w-8 h-8" /><div><h1 className="text-3xl font-bold">Flash Sale</h1><p className="text-red-100 text-sm">Limited time deals</p></div></div><span className="font-bold">Ends soon</span></div></header><div className="max-w-7xl mx-auto px-4 py-8"><div className="bg-white border-l-4 border-red-600 rounded-lg p-6 mb-8"><h2 className="text-2xl font-bold">Up to 58% Off Today!</h2><p className="text-gray-600">Limited-time products. Shop now.</p></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.map(product => <div key={product.id} className="bg-white border rounded-lg overflow-hidden"><div className="relative"><img src={product.image} alt={product.name} className="w-full aspect-square object-cover" /><div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded font-bold">-{product.discount}%</div><button onClick={() => setFavorites(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id])} className="absolute top-2 right-2 p-2 bg-white rounded-full"><Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} /></button></div><div className="p-3"><p className="font-bold text-sm mb-2">{product.name}</p><div className="flex gap-2"><span className="text-xl font-bold text-red-600">฿{product.price}</span><span className="text-sm text-gray-500 line-through">฿{product.originalPrice}</span></div><Link href={`/product/${product.id}`} className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg font-bold text-center block">Shop Now</Link></div></div>)}</div></div></main>
}
