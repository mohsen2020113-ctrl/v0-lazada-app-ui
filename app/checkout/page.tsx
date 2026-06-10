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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

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
              </div>
            )}

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors">Back</button>}
              <button onClick={() => step < 3 ? setStep(step + 1) : alert('Order placed!')} className="flex-1 px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors">{step === 3 ? 'Place Order' : 'Continue'}</button>
            </div>
          </div>

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
      </div>
    </div>
  )
}
