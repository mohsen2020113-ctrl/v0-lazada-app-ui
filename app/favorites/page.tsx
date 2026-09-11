'use client'

import { Heart, Share2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const mockProducts = Array(8).fill(null).map((_, i) => ({ id: i + 1, name: `Product ${i + 1}`, price: 30 + Math.random() * 100, originalPrice: 100 + Math.random() * 200, discount: Math.floor(20 + Math.random() * 40), image: `https://via.placeholder.com/200x200?text=Product${i + 1}` }))

export default function FavoritesPage() {
  const [items, setItems] = useState(mockProducts)
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4"><div className="max-w-7xl mx-auto flex items-center gap-4"><Link href="/" className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-6 h-6" /></Link><h1 className="text-2xl font-bold text-gray-900">My Favorites ({items.length})</h1></div></header>
      <div className="max-w-7xl mx-auto px-4 py-8">{items.length > 0 ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{items.map(product => <div key={product.id} className="bg-white border rounded-lg overflow-hidden"><div className="relative"><img src={product.image} alt={product.name} className="w-full aspect-square object-cover" /><button onClick={() => setItems(current => current.filter(item => item.id !== product.id))} className="absolute top-2 right-2 p-2 bg-white rounded-full"><Heart className="w-5 h-5 fill-pink-600 text-pink-600" /></button></div><div className="p-3"><Link href={`/product/${product.id}`} className="font-bold text-gray-900 text-sm">{product.name}</Link><p className="text-lg font-bold text-pink-600 mt-2">฿{product.price.toFixed(2)}</p><button className="mt-3 p-2 border rounded"><Share2 className="w-4 h-4" /></button></div></div>)}</div> : <div className="text-center py-20"><Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h2 className="text-2xl font-bold">No favorite items yet</h2><Link href="/" className="inline-block mt-6 px-6 py-3 bg-pink-600 text-white rounded-lg">Start Shopping</Link></div>}</div>
    </main>
  )
}
