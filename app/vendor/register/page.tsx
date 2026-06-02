'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Store, User, Phone, Mail, MapPin, FileText, CheckCircle } from 'lucide-react'

export default function VendorRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    storeName: '', ownerName: '', phone: '', email: '',
    city: '', category: '', description: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const inputClass = "w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#F57224] transition-colors"

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3">تم التسجيل بنجاح!</h2>
        <p className="text-gray-400 text-sm mb-8 max-w-xs">
          شكراً لتسجيلك كبائع. سيتم مراجعة طلبك والتواصل معك خلال 24-48 ساعة.
        </p>
        <button
          onClick={() => router.back()}
          className="px-8 py-3 bg-[#F57224] rounded-2xl font-semibold"
        >
          العودة للرئيسية
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white" dir="rtl">
      {/* Header */}
      <div className="bg-[#1A1A1A] px-4 py-4 flex items-center gap-3 border-b border-white/10">
        <button onClick={() => router.back()} className="text-white">
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-lg font-bold">تسجيل متجر جديد</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 px-4 py-4">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s ? 'bg-[#F57224] text-white' : 'bg-[#1A1A1A] text-gray-500'
            }`}>
              {s}
            </div>
            {s < 2 && <div className={`h-0.5 flex-1 mx-2 ${step > s ? 'bg-[#F57224]' : 'bg-white/10'}`} />}
          </div>
        ))}
        <div className="flex gap-2 text-xs text-gray-400 absolute right-16">
        </div>
      </div>

      <div className="p-4 space-y-4">
        {step === 1 ? (
          <>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">اسم المتجر</label>
              <div className="relative">
                <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.storeName} onChange={e => update('storeName', e.target.value)}
                  placeholder="اسم متجرك التجاري" className={inputClass + " pr-10"} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">اسم المالك</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.ownerName} onChange={e => update('ownerName', e.target.value)}
                  placeholder="الاسم الكامل" className={inputClass + " pr-10"} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.phone} onChange={e => update('phone', e.target.value)}
                  placeholder="+971 50 000 0000" type="tel" className={inputClass + " pr-10"} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="store@example.com" type="email" className={inputClass + " pr-10"} />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 bg-[#F57224] rounded-2xl font-semibold mt-4">
              التالي
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">المدينة</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.city} onChange={e => update('city', e.target.value)}
                  placeholder="مثال: دبي" className={inputClass + " pr-10"} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">فئة المتجر</label>
              <select value={form.category} onChange={e => update('category', e.target.value)}
                className={inputClass}>
                <option value="">اختر الفئة</option>
                <option value="electronics">إلكترونيات</option>
                <option value="fashion">أزياء</option>
                <option value="home">منزل ومطبخ</option>
                <option value="beauty">جمال وعناية</option>
                <option value="sports">رياضة</option>
                <option value="food">طعام وشراب</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">وصف المتجر</label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
                <textarea value={form.description} onChange={e => update('description', e.target.value)}
                  placeholder="اكتب وصفاً مختصراً عن متجرك..."
                  rows={4} className={inputClass + " pr-10 resize-none"} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 py-3 bg-[#1A1A1A] rounded-2xl font-semibold border border-white/10">
                رجوع
              </button>
              <button onClick={() => setSubmitted(true)} className="flex-1 py-3 bg-[#F57224] rounded-2xl font-semibold">
                إرسال الطلب
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
