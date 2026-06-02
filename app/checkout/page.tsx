'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, CreditCard, Truck, ChevronLeft, CheckCircle } from 'lucide-react'

const STORE_URL = 'https://www.4leee.com'

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState({ name: '', phone: '', city: '', area: '', street: '' })
  const [payment, setPayment] = useState('cod')

  const steps = ['العنوان', 'الدفع', 'التأكيد']

  if (step === 3) return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6" dir="rtl">
      <div className="w-24 h-24 rounded-full bg-[#F57224]/15 flex items-center justify-center mb-6">
        <CheckCircle size={56} className="text-[#F57224]" />
      </div>
      <h2 className="text-white text-2xl font-black mb-2">تم الطلب بنجاح!</h2>
      <p className="text-white/40 text-sm text-center mb-8">سيتم التواصل معك لتأكيد الطلب وتحديد موعد التوصيل</p>
      <button onClick={() => router.push('/')}
        className="w-full bg-[#F57224] text-white font-bold py-4 rounded-2xl">
        متابعة التسوق
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => step > 1 ? setStep(s => s-1) : router.back()}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <span className="text-white font-bold">إتمام الطلب</span>
      </div>

      {/* Steps */}
      <div className="flex items-center px-6 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i+1 <= step ? 'bg-[#F57224] text-white' : 'bg-white/10 text-white/30'}`}>
                {i+1 < step ? '✓' : i+1}
              </div>
              <span className={`text-xs mt-1 ${i+1 <= step ? 'text-[#F57224]' : 'text-white/30'}`}>{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-2 mb-4 ${i+1 < step ? 'bg-[#F57224]' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="px-4 pb-32">
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-[#F57224]" />
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
              <CreditCard size={20} className="text-[#F57224]" />
              <span className="text-white font-bold">طريقة الدفع</span>
            </div>
            <div className="space-y-3">
              {[
                { id: 'cod', label: 'الدفع عند الاستلام', sub: 'ادفع نقداً عند وصول طلبك', icon: '💵' },
                { id: 'card', label: 'بطاقة ائتمانية', sub: 'Visa / Mastercard', icon: '💳' },
                { id: 'apple', label: 'Apple Pay', sub: 'ادفع بسرعة وأمان', icon: '🍎' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setPayment(opt.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-colors ${payment === opt.id ? 'border-[#F57224] bg-[#F57224]/10' : 'border-white/10 bg-[#1A1A1A]'}`}>
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1 text-right">
                    <p className="text-white font-semibold text-sm">{opt.label}</p>
                    <p className="text-white/40 text-xs">{opt.sub}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === opt.id ? 'border-[#F57224]' : 'border-white/20'}`}>
                    {payment === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#F57224]" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 bg-[#1A1A1A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={16} className="text-[#F57224]" />
                <span className="text-white text-sm font-bold">ملخص الطلب</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/50">المجموع الفرعي</span><span className="text-white">0.00 AED</span></div>
                <div className="flex justify-between"><span className="text-white/50">الشحن</span><span className="text-[#F57224]">مجاني</span></div>
                <div className="flex justify-between pt-2 border-t border-white/10"><span className="text-white font-bold">الإجمالي</span><span className="text-[#F57224] font-extrabold">0.00 AED</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F0F0F]/95 backdrop-blur-sm">
        <button onClick={() => step < 2 ? setStep(s => s+1) : setStep(3)}
          className="w-full bg-[#F57224] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
          {step === 2 ? 'تأكيد الطلب' : 'التالي'}
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  )
              }
