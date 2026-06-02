'use client'
import { useState } from 'react'
import { Tag, Copy, Check, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const VOUCHERS = [
  { code: 'LEE30', discount: '30 AED', min: '100 AED', expires: '30 يونيو', color: '#F57224', type: 'خصم ثابت' },
  { code: 'FREESHIP', discount: 'شحن مجاني', min: '50 AED', expires: '31 يوليو', color: '#22C55E', type: 'شحن مجاني' },
  { code: 'LEE10', discount: '10%', min: '200 AED', expires: '15 يوليو', color: '#3B82F6', type: 'نسبة خصم' },
  { code: 'NEW50', discount: '50 AED', min: '150 AED', expires: '31 أغسطس', color: '#8B5CF6', type: 'عميل جديد' },
  { code: 'VIP100', discount: '100 AED', min: '500 AED', expires: '31 ديسمبر', color: '#F59E0B', type: 'VIP فقط' },
]

export default function VouchersPage() {
  const router = useRouter()
  const [copied, setCopied] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">القسائم والكوبونات</h1>
      </div>

      {/* Banner */}
      <div className="mx-4 mb-5 rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F57224 0%, #E04E0F 100%)' }}>
        <div className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Tag size={28} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-lg">وفّر أكثر مع كوبوناتك</p>
            <p className="text-white/70 text-sm">{VOUCHERS.length} كوبون متاح لك الآن</p>
          </div>
        </div>
      </div>

      {/* Voucher List */}
      <div className="px-4 space-y-3 pb-24">
        {VOUCHERS.map(v => (
          <div key={v.code} className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
            <div className="flex">
              {/* Left color strip */}
              <div className="w-2 shrink-0" style={{ background: v.color }} />
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ background: v.color + '33', color: v.color }}>{v.type}</span>
                    </div>
                    <p className="text-white font-black text-xl">{v.discount}</p>
                    <p className="text-white/40 text-xs mt-0.5">حد أدنى للطلب {v.min}</p>
                    <p className="text-white/30 text-xs">ينتهي {v.expires}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-[#0F0F0F] rounded-xl px-3 py-2 border border-dashed border-white/20">
                      <span className="text-white font-mono font-bold text-sm tracking-wider">{v.code}</span>
                    </div>
                    <button
                      onClick={() => copyCode(v.code)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                      style={{ background: copied === v.code ? '#22C55E20' : v.color + '20', color: copied === v.code ? '#22C55E' : v.color }}
                    >
                      {copied === v.code ? <Check size={12} /> : <Copy size={12} />}
                      {copied === v.code ? 'تم النسخ!' : 'نسخ الكود'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
                      }
