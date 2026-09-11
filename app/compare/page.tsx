'use client'

import { ChevronLeft, Heart, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

const products = [
  { id: 1, name: 'Product A', price: 49.99, rating: 4.8, reviews: 2500, color: 'Red', size: 'M', material: 'Cotton' },
  { id: 2, name: 'Product B', price: 59.99, rating: 4.5, reviews: 1800, color: 'Blue', size: 'L', material: 'Polyester' },
  { id: 3, name: 'Product C', price: 39.99, rating: 4.9, reviews: 3200, color: 'Black', size: 'S', material: 'Cotton Blend' },
]

const specs = ['Price', 'Rating', 'Reviews', 'Color', 'Size', 'Material', 'Stock']

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Compare Products</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 text-left font-bold bg-gray-50">Specification</th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 text-center font-bold bg-gray-50 border-l border-gray-200">
                    <p className="font-bold text-gray-900">{product.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec) => (
                <tr key={spec} className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-700 bg-gray-50">{spec}</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center border-l border-gray-200">
                      {spec === 'Price' && `฿${product.price}`}
                      {spec === 'Rating' && <span className="text-amber-400">★ {product.rating}</span>}
                      {spec === 'Reviews' && `${product.reviews} reviews`}
                      {spec === 'Color' && product.color}
                      {spec === 'Size' && product.size}
                      {spec === 'Material' && product.material}
                      {spec === 'Stock' && <span className="text-green-600 font-bold">In Stock</span>}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={products.length + 1} className="p-4">
                  <div className="grid grid-cols-4 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex gap-2">
                        <button className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" /> Add
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
