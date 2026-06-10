'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, ArrowDownLeft, ArrowUpRight, Gift, Star } from 'lucide-react'

const TRANSACTIONS = [
  { id: 1, title: 'رصيد مكافآت', sub: 'مشتريات قيمتها 500 AED', amount: '+25 AED', type: 'credit', date: 'اليوم' },
  { id: 2, title: 'خصم بالمحفظة', sub: 'Order #ORD-1042', amount: '-30 AED', type: 'debit', date: 'أمس' },
  { id: 3, title: 'هدية ترحيب', sub: 'مكافأة العميل الجديد', amount: '+50 AED', type: 'credit', date: '2 يونيو' },
  { id: 4, title: 'استرداد مبلغ', sub: 'Order #ORD-0991 ملغى', amount: '+120 AED', type: 'credit', date: '30 مايو' },
  { id: 5, title: 'خصم بالمحفظة', sub: 'Order #ORD-0980', amount: '-80 AED', type: 'debit', date: '28 مايو' },
]

export default function WalletPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">المحفظة</h1>
      </div>

      {/* Balance Card */}
      <div className="mx-4 mb-5 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F57224 0%, #C13D00 100%)' }}>
        <div className="p-6">
          <p className="text-white/70 text-sm mb-1">الرصيد المتاح</p>
          <p className="text-white font-black text-4xl mb-4">85.00 <span className="text-2xl">AED</span></p>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/20 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5">
              <Plus size={16} /> شحن الرصيد
            </button>
            <button className="flex-1 bg-white/20 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5">
              <Gift size={16} /> أرسل هدية
            </button>
          </div>
        </div>
        {/* Points strip */}
        <div className="bg-black/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white/80 text-xs">نقاط المكافآت</span>
          </div>
          <span className="text-yellow-400 font-black text-sm">1,250 نقطة</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🏷️', label: 'استخدام كوبون' },
            { icon: '📦', label: 'دفع الOrderات' },
            { icon: '🎁', label: 'المكافآت' },
          ].map(a => (
            <button key={a.label} className="bg-[#1A1A1A] rounded-2xl py-4 flex flex-col items-center gap-2">
              <span className="text-2xl">{a.icon}</span>
              <span className="text-white/60 text-xs">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4 pb-24">
        <p className="text-white/40 text-xs font-bold tracking-wider mb-3">سجل المعاملات</p>
        <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden divide-y divide-white/5">
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                {tx.type === 'credit'
                  ? <ArrowDownLeft size={18} className="text-green-400" />
                  : <ArrowUpRight size={18} className="text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{tx.title}</p>
                <p className="text-white/30 text-xs">{tx.sub}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>{tx.amount}</p>
                <p className="text-white/30 text-xs">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
