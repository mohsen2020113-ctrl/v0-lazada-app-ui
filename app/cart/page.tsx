"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Shield, RotateCcw, Truck } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useLanguage } from "@/contexts/LanguageContext"
import Header from "@/components/Header"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { locale } = useLanguage()
  const isAr = locale === "ar"

  const t = (en: string, ar: string) => isAr ? ar : en

  const formatPrice = (amount: number) =>
    `AED ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t("Your cart is empty", "سلتك فارغة")}
          </h2>
          <p className="text-gray-500 mb-8">
            {t("Add items to get started", "أضف منتجات للبدء")}
          </p>
          <Link
            href="/"
            className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Start Shopping", "ابدأ التسوق")}
          </Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <Header />

      {/* Page Title */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">
          {t("My Cart", "سلة التسوق")} ({items.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600"
        >
          {t("Clear All", "مسح الكل")}
        </button>
      </div>

      {/* Trust Badges */}
      <div className="bg-white border-b px-4 py-2 flex items-center gap-6 text-xs text-gray-500 overflow-x-auto">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <RotateCcw className="w-3 h-3 text-pink-500" />
          {t("Free Returns (30 Days)", "إرجاع مجاني (30 يوم)")}
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Shield className="w-3 h-3 text-pink-500" />
          {t("Secure Payment", "دفع آمن")}
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Truck className="w-3 h-3 text-pink-500" />
          {t("Fast Delivery", "توصيل سريع")}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 pb-32">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-3">
            {/* Product Image */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                {item.name}
              </h3>
              <p className="text-pink-600 font-bold text-base mb-3">
                {formatPrice(item.price)}
              </p>

              {/* Quantity + Delete */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-pink-500"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-pink-500"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 font-medium">{t("Total", "الإجمالي")}</span>
          <span className="text-xl font-bold text-pink-600">{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-pink-500 hover:bg-pink-600 text-white text-center py-3.5 rounded-xl font-bold text-base transition-colors"
        >
          {t("Proceed to Checkout", "متابعة للدفع")}
        </Link>
      </div>
    </div>
  )
}
