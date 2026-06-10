'use client'

import { ShoppingCart, Trash2, Heart, ChevronLeft, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'Tissue Paper Roll - 4 Pack', price: 37.9, originalPrice: 90, quantity: 2, image: 'https://via.placeholder.com/100x100?text=Product1', stock: 15 },
    { id: 2, name: 'Premium Hand Soap', price: 45.5, originalPrice: 120, quantity: 1, image: 'https://via.placeholder.com/100x100?text=Product2', stock: 8 },
  ])

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return
    setItems(items.map((item) => (item.id === id ? { ...item, quantity: qty } : item)))
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const discount = subtotal > 500 ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({items.length})</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-3"><span className="text-lg font-bold text-pink-600">฿{item.price}</span><span className="text-sm text-gray-500 line-through">฿{item.originalPrice}</span></div>
                    <p className="text-xs text-gray-600 mb-4">{item.stock} in stock</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                        <span className="px-4 py-1 border-l border-r border-gray-300 font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors text-sm"><Trash2 className="w-4 h-4" /> Remove</button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-pink-600 transition-colors text-sm ml-auto"><Heart className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24 space-y-4">
                <h2 className="font-bold text-lg text-gray-900">Order Summary</h2>
                <div className="space-y-2 text-sm border-b border-gray-200 pb-4">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-bold">฿{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-bold">{shipping === 0 ? 'Free' : `฿${shipping.toFixed(2)}`}</span></div>
                  {discount > 0 && <div className="flex justify-between text-teal-600"><span>Discount</span><span className="font-bold">-฿{discount.toFixed(2)}</span></div>}
                </div>
                <div className="flex justify-between text-lg"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-pink-600">฿{total.toFixed(2)}</span></div>
                <Link href="/checkout" className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors text-center block">Proceed to Checkout</Link>
                <Link href="/" className="w-full border border-gray-300 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors text-center block">Continue Shopping</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20"><ShoppingCart className="w-16 h-16 text-gray-300 mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2><p className="text-gray-600 mb-6">Add items to your cart to get started</p><Link href="/" className="px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors">Continue Shopping</Link></div>
        )}
      </div>
    </div>
  )
}
