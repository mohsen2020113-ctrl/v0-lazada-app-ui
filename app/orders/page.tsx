'use client'
import Link from 'next/link'
import { Package, ChevronLeft, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'

const MOCK_ORDERS = [
  { id: '#1001', date: '2024-12-01', status: 'delivered', total: '350', items: 2 },
  { id: '#1002', date: '2024-12-10', status: 'shipping', total: '180', items: 1 },
  { id: '#1003', date: '2024-12-15', status: 'processing', total: '520', items: 3 },
]

const STATUS_MAP: Record<string, { label: string; color: string; Icon: any }> = {
  delivered: { label: 'تم التسليم', color: 'text-green-400', Icon: CheckCircle },
  shipping: { label: 'قيد الشحن', color: 'text-blue-400', Icon: Truck },
  processing: { label: 'قيد المعالجة', color: 'text-[#F57224]', Icon: Clock },
  cancelled: { label: 'ملغي', color: 'text-red-400', Icon: XCircle },
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="bg-[#0F0F0F] px-4 py-4 border-b border-white/5">
        <h1 className="text-white font-bold text-lg">Orderاتي</h1>
      </div>

      <div className="px-4 py-4 pb-24">
        {MOCK_ORDERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Package size={56} className="text-white/10" />
            <p className="text-white/40 text-sm">لا توجد Orderات بعد</p>
            <Link href="/" className="bg-[#F57224] text-white text-sm font-bold px-6 py-3 rounded-xl">
              ابدأ التسوق
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_ORDERS.map(order => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.processing
              const Icon = status.Icon
              return (
                <div key={order.id} className="bg-[#1A1A1A] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-bold text-sm">{order.id}</p>
                      <p className="text-white/40 text-xs mt-0.5">{order.date}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 ${status.color}`}>
                      <Icon size={14} />
                      <span className="text-xs font-medium">{status.label}</span>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-white/50 text-xs">{order.items} Productات</p>
                      <p className="text-[#F57224] font-bold text-sm mt-0.5">{order.total} AED</p>
                    </div>
                    <button className="flex items-center gap-1 text-white/40 text-xs">
                      تفاصيل
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
