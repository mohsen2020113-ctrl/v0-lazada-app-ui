'use client'

import { ShoppingCart, Trash2, Heart, ChevronLeft, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
<<<<<<< HEAD
  const [items, setItems] = useState([
    { id: 1, name: 'Tissue Paper Roll - 4 Pack', price: 37.9, originalPrice: 90, quantity: 2, image: 'https://via.placeholder.com/100x100?text=Product1', stock: 15 },
    { id: 2, name: 'Premium Hand Soap', price: 45.5, originalPrice: 120, quantity: 1, image: 'https://via.placeholder.com/100x100?text=Product2', stock: 8 },
  ])
=======
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const [showConfirm, setShowConfirm] = useState(false)
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2

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

<<<<<<< HEAD
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
=======
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
            style={{ background: 'rgba(194,24,91,0.15)' }}>
            <ShoppingCart size={48} className="text-[#C2185B]" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">سلتك فارغة</h2>
          <p className="text-white/40 text-sm mb-7">أضف منتجات للبدء في التسوق</p>
          <Link
            href="/"
            className="bg-[#C2185B] text-white font-bold px-8 py-3.5 rounded-2xl"
          >
            ابدأ التسوق
          </Link>
        </div>
      ) : (
        <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 64px)' }}>
          {/* Items */}
          <div className="flex-1 px-4 pt-2 pb-4 space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="bg-[#1A1A1A] rounded-2xl p-3 flex gap-3">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-cover bg-[#2A2A2A]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
                  {item.variantTitle && item.variantTitle !== 'Default Title' && (
                    <p className="text-white/40 text-xs mt-0.5">{item.variantTitle}</p>
                  )}
                  <p className="text-[#C2185B] text-base font-bold mt-1.5">
                    {(item.price * item.quantity).toFixed(2)} AED
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={() => removeFromCart(item.variantId)} className="text-white/30">
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center gap-1 mt-auto">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-7 h-7 bg-[#2A2A2A] rounded-lg flex items-center justify-center"
                    >
                      <Minus size={12} className="text-white/70" />
                    </button>
                    <span className="w-7 text-center text-white font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-7 h-7 bg-[#2A2A2A] rounded-lg flex items-center justify-center"
                    >
                      <Plus size={12} className="text-white/70" />
                    </button>
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
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
=======
          {/* Summary */}
          <div className="bg-[#1A1A1A] rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/50 text-sm">{items.length} منتجات</span>
              <span className="text-white text-xl font-extrabold">{cartTotal?.toFixed(2)} AED</span>
            </div>
            <div className="border-t border-white/10 pt-3 mb-1">
              <div className="flex justify-between mb-1.5">
                <span className="text-white/40 text-sm">المجموع الفرعي</span>
                <span className="text-white font-semibold text-sm">{cartTotal?.toFixed(2)} AED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 text-sm">الشحن</span>
                <span className="text-[#C2185B] text-xs">يُحسب عند الدفع</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-[#C2185B] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              إتمام الشراء
            </button>
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20"><ShoppingCart className="w-16 h-16 text-gray-300 mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2><p className="text-gray-600 mb-6">Add items to your cart to get started</p><Link href="/" className="px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors">Continue Shopping</Link></div>
        )}
      </div>
    </div>
  )
}
