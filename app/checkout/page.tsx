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

  const steps = [
    { id: 1, label: 'Shipping', icon: MapPin },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Review', icon: CheckCircle2 },
  ]
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

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          {steps.map((s, idx) => {
            const Icon = s.icon
            return <div key={s.id} className="flex items-center flex-1"><div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${s.id <= step ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-600'}`}><Icon className="w-5 h-5" /></div><p className={`ml-2 font-bold text-sm ${s.id <= step ? 'text-pink-600' : 'text-gray-600'}`}>{s.label}</p>{idx < steps.length - 1 && <div className={`flex-1 h-1 mx-4 ${s.id < step ? 'bg-pink-600' : 'bg-gray-300'}`} />}</div>
          })}
        </div>
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          {step === 1 && <div className="space-y-4"><h2 className="text-xl font-bold">Shipping information</h2><input className="w-full border rounded-lg p-3" placeholder="Full name" /><input className="w-full border rounded-lg p-3" placeholder="Address" /></div>}
          {step === 2 && <div className="space-y-4"><h2 className="text-xl font-bold">Payment method</h2><button onClick={() => setPayment('credit_card')} className="w-full border rounded-lg p-4 text-left">Credit card</button><button onClick={() => setPayment('cod')} className="w-full border rounded-lg p-4 text-left">Cash on delivery</button></div>}
          {step === 3 && <div className="space-y-4"><CheckCircle2 className="w-12 h-12 text-pink-600" /><h2 className="text-xl font-bold">Order review</h2><p>Total: {total.toFixed(2)} AED</p></div>}
          <div className="flex gap-4 mt-8 pt-6 border-t"><button disabled={step === 1} onClick={() => setStep(step - 1)} className="flex-1 px-6 py-3 border rounded-lg disabled:opacity-40">Back</button><button onClick={() => setStep(step < 3 ? step + 1 : 1)} className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg">{step === 3 ? 'Place Order' : 'Continue'}</button></div>
        </section>
      </div>
    </main>
  )
}
