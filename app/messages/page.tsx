'use client'
import { ExternalLink, MessageCircle, Mail, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const WHATSAPP = '+971500000000'
const STORE_URL = 'https://www.4leee.com'

const FAQS = [
  { q: 'كيف أتتبع طلبي؟', a: 'يمكنك تتبع طلبك من خلال صفحة حسابي > تتبع الطلبات' },
  { q: 'ما هي سياسة الإرجاع؟', a: 'نقبل الإرجاع خلال 14 يوماً من تاريخ الاستلام' },
  { q: 'كم تستغرق الشحنة؟', a: 'يتم التوصيل خلال 3-5 أيام عمل داخل الإمارات' },
  { q: 'هل الدفع آمن؟', a: 'نعم، جميع عمليات الدفع مؤمّنة ومشفّرة بالكامل' },
]

export default function MessagesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24" dir="rtl">
      <div className="bg-[#0F0F0F] px-4 py-4 border-b border-white/5">
        <h1 className="text-white font-bold text-lg">الرسائل</h1>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Hero */}
        <div className="bg-gradient-to-bl from-[#F57224] to-[#E04E0F] rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h2 className="text-white font-bold text-lg mb-1">تواصل مع فريق الدعم</h2>
          <p className="text-white/70 text-sm">نحن هنا للمساعدة على مدار الساعة</p>
        </div>

        {/* Contact channels */}
        <div>
          <p className="text-white/50 text-xs font-bold tracking-wide mb-3">قنوات التواصل</p>
          <div className="space-y-2.5">
            <a href={`https://wa.me/${WHATSAPP.replace('+','')}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1A1A1A] rounded-2xl p-4">
              <div className="w-11 h-11 rounded-xl bg-[#25D366]/15 flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-[#25D366]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">واتساب</p>
                <p className="text-white/40 text-xs">تحدث معنا مباشرة</p>
              </div>
              <ExternalLink size={16} className="text-white/30" />
            </a>

            <a href="mailto:support@4leee.com"
              className="flex items-center gap-3 bg-[#1A1A1A] rounded-2xl p-4">
              <div className="w-11 h-11 rounded-xl bg-[#F57224]/15 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-[#F57224]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">البريد الإلكتروني</p>
                <p className="text-white/40 text-xs">support@4leee.com</p>
              </div>
              <ExternalLink size={16} className="text-white/30" />
            </a>

            <a href={`${STORE_URL}/pages/contact`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1A1A1A] rounded-2xl p-4">
              <div className="w-11 h-11 rounded-xl bg-[#1DA1F2]/15 flex items-center justify-center shrink-0">
                <Globe size={20} className="text-[#1DA1F2]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">نموذج التواصل</p>
                <p className="text-white/40 text-xs">أرسل رسالة عبر الموقع</p>
              </div>
              <ExternalLink size={16} className="text-white/30" />
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <p className="text-white/50 text-xs font-bold tracking-wide mb-3">الأسئلة الشائعة</p>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-4 text-right"
                >
                  <span className="text-white text-sm font-medium">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={16} className="text-[#F57224] shrink-0" />
                    : <ChevronDown size={16} className="text-white/30 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-white/50 text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
