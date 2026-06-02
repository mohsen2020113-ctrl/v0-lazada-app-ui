'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Trash2, Plus, Minus, Lock, ChevronRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [showConfirm, setShowConfirm] = useState(false)

  const isEmpty = !items || items.length === 0

  const handleCheckout = () => {
    window.open('https://smcicw-19.myshopify.com/checkout', '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* AppBar */}
      <div className="bg-[#0F0F0F] px-4 py-4 flex items-center justify-between">
        <h1 className="text-white text-lg font-bold">سلة التسوق</h1>
        {!isEmpty && (
          <button onClick={() => setShowConfirm(true)} className="text-white/50 text-sm font-semibold">
            مسح الكل
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
            style={{ background: 'rgba(245,114,36,0.15)' }}>
            <ShoppingCart size={48} className="text-[#F57224]" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">سلتك فارغة</h2>
          <p className="text-white/40 text-sm mb-7">أضف منتجات للبدء في التسوق</p>
          <Link
            href="/"
            className="bg-[#F57224] text-white font-bold px-8 py-3.5 rounded-2xl"
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
                  {item.variant && item.variant !== 'Default Title' && (
                    <p className="text-white/40 text-xs mt-0.5">{item.variant}</p>
                  )}
                  <p className="text-[#F57224] text-base font-bold mt-1.5">
                    {(item.price * item.quantity).toFixed(2)} AED
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={() => removeItem(item.id)} className="text-white/30">
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center gap-1 mt-auto">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 bg-[#2A2A2A] rounded-lg flex items-center justify-center"
                    >
                      <Minus size={12} className="text-white/70" />
                    </button>
                    <span className="w-7 text-center text-white font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 bg-[#2A2A2A] rounded-lg flex items-center justify-center"
                    >
                      <Plus size={12} className="text-white/70" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-[#1A1A1A] rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/50 text-sm">{items.length} منتجات</span>
              <span className="text-white text-xl font-extrabold">{total?.toFixed(2)} AED</span>
            </div>
            <div className="border-t border-white/10 pt-3 mb-1">
              <div className="flex justify-between mb-1.5">
                <span className="text-white/40 text-sm">المجموع الفرعي</span>
                <span className="text-white font-semibold text-sm">{total?.toFixed(2)} AED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 text-sm">الشحن</span>
                <span className="text-[#F57224] text-xs">يُحسب عند الدفع</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-[#F57224] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              إتمام الشراء
            </button>
          </div>
        </div>
      )}

      {/* Confirm Clear Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-bold text-base mb-2">مسح السلة</h3>
            <p className="text-white/60 text-sm mb-5">هل تريد إزالة جميع المنتجات من سلتك؟</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="text-white/40 font-medium text-sm px-4 py-2">
                إلغاء
              </button>
              <button
                onClick={() => { clearCart?.(); setShowConfirm(false) }}
                className="text-red-400 font-bold text-sm px-4 py-2"
              >
                مسح
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
