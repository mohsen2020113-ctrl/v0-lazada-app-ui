'use client'

import { ChevronLeft, MapPin, CreditCard, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [payment, setPayment] = useState('credit_card')

  const cartTotal = 83.4
  const shippingCost = shippingMethod === 'express' ? 100 : 50
  const total = cartTotal + shippingCost

<<<<<<< HEAD
  const steps = [
    { id: 1, label: 'Shipping', icon: MapPin },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Review', icon: CheckCircle2 },
  ]
=======
  if (step === 3) return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6" dir="rtl">
      <div className="w-24 h-24 rounded-full bg-[#C2185B]/15 flex items-center justify-center mb-6">
        <CheckCircle size={56} className="text-[#C2185B]" />
      </div>
      <h2 className="text-white text-2xl font-black mb-2">تم الطلب بنجاح!</h2>
      <p className="text-white/40 text-sm text-center mb-8">سيتم التواصل معك لتأكيد الطلب وتحديد موعد التوصيل</p>
      <button onClick={() => router.push('/')}
        className="w-full bg-[#C2185B] text-white font-bold py-4 rounded-2xl">
        متابعة التسوق
      </button>
    </div>
  )
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

<<<<<<< HEAD
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          {steps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${s.id <= step ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`ml-2 font-bold text-sm ${s.id <= step ? 'text-pink-600' : 'text-gray-600'}`}>{s.label}</p>
                {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-4 ${s.id < step ? 'bg-pink-600' : 'bg-gray-300'}`} />}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                  <input type="tel" placeholder="Phone Number" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                </div>
                <input type="text" placeholder="Street Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="District" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                  <input type="text" placeholder="City" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                  <input type="text" placeholder="Postcode" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    {[{ id: 'standard', label: 'Standard Shipping (48H)', price: 50 }, { id: 'express', label: 'Express Shipping (24H)', price: 100 }].map((method) => (
                      <label key={method.id} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="shipping" value={method.id} checked={shippingMethod === method.id} onChange={(e) => setShippingMethod(e.target.value)} className="w-4 h-4 accent-pink-600" />
                        <div className="ml-3 flex-1"><p className="font-bold text-gray-900">{method.label}</p></div>
                        <span className="font-bold text-pink-600">฿{method.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                <div className="space-y-3">
                  {[{ id: 'credit_card', label: 'Credit Card' }, { id: 'debit_card', label: 'Debit Card' }, { id: 'paypal', label: 'PayPal' }, { id: 'cod', label: 'Cash on Delivery' }].map((method) => (
                    <label key={method.id} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value={method.id} checked={payment === method.id} onChange={(e) => setPayment(e.target.value)} className="w-4 h-4 accent-pink-600" />
                      <span className="ml-3 font-bold text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Order Review</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div><p className="text-sm text-gray-600">Shipping Method</p><p className="font-bold text-gray-900">{shippingMethod === 'express' ? 'Express (24H)' : 'Standard (48H)'}</p></div>
                  <div><p className="text-sm text-gray-600">Payment</p><p className="font-bold text-gray-900">{payment === 'credit_card' ? 'Credit Card' : payment === 'debit_card' ? 'Debit Card' : payment === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</p></div>
                </div>
=======
      {/* Steps */}
      <div className="flex items-center px-6 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i+1 <= step ? 'bg-[#C2185B] text-white' : 'bg-white/10 text-white/30'}`}>
                {i+1 < step ? '✓' : i+1}
              </div>
              <span className={`text-xs mt-1 ${i+1 <= step ? 'text-[#C2185B]' : 'text-white/30'}`}>{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-2 mb-4 ${i+1 < step ? 'bg-[#C2185B]' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="px-4 pb-32">
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-[#C2185B]" />
              <span className="text-white font-bold">عنوان التوصيل</span>
            </div>
            {[
              { label: 'الاسم الكامل', key: 'name', placeholder: 'محمد عبدالله' },
              { label: 'رقم الهاتف', key: 'phone', placeholder: '05xxxxxxxx' },
              { label: 'المدينة', key: 'city', placeholder: 'دبي' },
              { label: 'المنطقة / الحي', key: 'area', placeholder: 'الخليج التجاري' },
              { label: 'الشارع والبناية', key: 'street', placeholder: 'شارع الشيخ زايد، بناية 123' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-white/50 text-xs mb-1 block">{label}</label>
                <input
                  value={(address as any)[key]}
                  onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-[#1A1A1A] text-white rounded-2xl px-4 h-12 text-sm outline-none placeholder-white/20"
                />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-[#C2185B]" />
              <span className="text-white font-bold">طريقة الدفع</span>
            </div>
            <div className="space-y-3">
              {[
                { id: 'cod', label: 'الدفع عند الاستلام', sub: 'ادفع نقداً عند وصول طلبك', icon: '💵' },
                { id: 'card', label: 'بطاقة ائتمانية', sub: 'Visa / Mastercard', icon: '💳' },
                { id: 'apple', label: 'Apple Pay', sub: 'ادفع بسرعة وأمان', icon: '🍎' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setPayment(opt.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-colors ${payment === opt.id ? 'border-[#C2185B] bg-[#C2185B]/10' : 'border-white/10 bg-[#1A1A1A]'}`}>
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1 text-right">
                    <p className="text-white font-semibold text-sm">{opt.label}</p>
                    <p className="text-white/40 text-xs">{opt.sub}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === opt.id ? 'border-[#C2185B]' : 'border-white/20'}`}>
                    {payment === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#C2185B]" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 bg-[#1A1A1A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={16} className="text-[#C2185B]" />
                <span className="text-white text-sm font-bold">ملخص الطلب</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/50">المجموع الفرعي</span><span className="text-white">0.00 AED</span></div>
                <div className="flex justify-between"><span className="text-white/50">الشحن</span><span className="text-[#C2185B]">مجاني</span></div>
                <div className="flex justify-between pt-2 border-t border-white/10"><span className="text-white font-bold">الإجمالي</span><span className="text-[#C2185B] font-extrabold">0.00 AED</span></div>
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
              </div>
            )}

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors">Back</button>}
              <button onClick={() => step < 3 ? setStep(step + 1) : alert('Order placed!')} className="flex-1 px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors">{step === 3 ? 'Place Order' : 'Continue'}</button>
            </div>
          </div>

<<<<<<< HEAD
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24 space-y-4">
              <h2 className="font-bold text-lg text-gray-900">Order Summary</h2>
              <div className="space-y-2 text-sm border-b border-gray-200 pb-4">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-bold">฿{cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-bold">฿{shippingCost.toFixed(2)}</span></div>
              </div>
              <div className="flex justify-between text-lg"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-pink-600">฿{total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
=======
      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F0F0F]/95 backdrop-blur-sm">
        <button onClick={() => step < 2 ? setStep(s => s+1) : setStep(3)}
          className="w-full bg-[#C2185B] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C2185B]/30">
          {step === 2 ? 'تأكيد الطلب' : 'التالي'}
          <ChevronLeft size={18} />
        </button>
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
      </div>
    </div>
  )
}
