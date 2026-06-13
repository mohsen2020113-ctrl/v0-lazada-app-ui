'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  status: string | null
  total: number | null
  currency: string | null
  shipping_address: Record<string, string> | null
  created_at: string | null
  payment_method: string | null
}

interface LowStockItem {
  product_id: string
  sku: string | null
  quantity: number
  available_quantity: number
  low_stock_threshold: number
  warehouse_location: string | null
}

interface DashboardData {
  recentOrders: Order[]
  kpis: {
    totalOrders: number
    totalSales: number
    avgOrderValue: number
    shopifyProductsCount: number
    registeredUsers: number
  }
  topCountries: { name: string; orders: number }[]
  lowStock: LowStockItem[]
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  refunded:   'bg-gray-100 text-gray-700',
}

const STATUS_AR: Record<string, string> = {
  pending:    'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped:    'تم الشحن',
  delivered:  'تم التسليم',
  cancelled:  'ملغى',
  refunded:   'مُسترد',
}

function KPICard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className={`rounded-2xl p-5 text-white shadow-md flex flex-col gap-1 ${color}`}>
      <span className="text-xs font-medium opacity-80">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
      {sub && <span className="text-xs opacity-70">{sub}</span>}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <span className="text-4xl mb-3">📭</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default function DashboardUI({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState<'orders' | 'countries' | 'stock'>('orders')
  const { kpis, recentOrders, topCountries, lowStock } = data
  const maxCountryOrders = topCountries[0]?.orders ?? 1

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-[#F50057] flex items-center justify-center text-white font-bold text-lg">4</Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">4LEEE</h1>
            <p className="text-xs text-gray-500">لوحة تحكم التاجر</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-[#F50057] border border-[#F50057] rounded-lg px-3 py-1.5 hover:bg-pink-50 transition-colors">← الموقع</Link>
        </div>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">لوحة المعلومات</h2>
            <p className="text-gray-500 text-sm mt-1">
              آخر تحديث: {new Date().toLocaleDateString('ar-AE')} —{' '}
              <span className="text-green-600 font-medium">● متصل بـ Supabase</span>
            </p>
          </div>
          {kpis.totalOrders === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-xs text-blue-700">
              المتجر جديد — الطلبات ستظهر هنا فور ورودها
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <KPICard label="إجمالي المبيعات" value={kpis.totalSales > 0 ? `AED ${kpis.totalSales.toLocaleString('ar-AE', { maximumFractionDigits: 0 })}` : 'AED 0'} sub={kpis.totalSales > 0 ? 'من Supabase' : 'لا توجد مبيعات بعد'} color="bg-gradient-to-br from-[#F50057] to-pink-600" />
          <KPICard label="إجمالي الطلبات" value={kpis.totalOrders.toLocaleString('ar-AE')} sub={kpis.totalOrders > 0 ? 'طلب حقيقي' : 'لا توجد طلبات بعد'} color="bg-gradient-to-br from-blue-500 to-blue-600" />
          <KPICard label="متوسط قيمة الطلب" value={kpis.avgOrderValue > 0 ? `AED ${kpis.avgOrderValue.toFixed(0)}` : 'AED —'} sub="محسوب من الطلبات الفعلية" color="bg-gradient-to-br from-purple-500 to-purple-600" />
          <KPICard label="منتجات Shopify" value={kpis.shopifyProductsCount.toLocaleString('ar-AE')} sub="منتج نشط" color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
          <KPICard label="مستخدمون مسجلون" value={kpis.registeredUsers.toLocaleString('ar-AE')} sub="في Supabase" color="bg-gradient-to-br from-orange-500 to-orange-600" />
        </div>

        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {([
            { key: 'orders' as const, label: `آخر الطلبات (${recentOrders.length})` },
            { key: 'countries' as const, label: `الدول (${topCountries.length})` },
            { key: 'stock' as const, label: `تنبيهات المخزون (${lowStock.length})` },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.key ? 'bg-[#F50057] text-white' : 'text-gray-600 hover:text-[#F50057]'}`}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            {recentOrders.length === 0 ? <EmptyState message="لا توجد طلبات بعد — ستظهر هنا فور ورودها من العملاء" /> : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['رقم الطلب', 'الحالة', 'المبلغ', 'طريقة الدفع', 'الدولة', 'التاريخ'].map(h => <th key={h} className="px-4 py-3 text-right font-semibold text-gray-700 text-xs">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => {
                    const addr = order.shipping_address
                    const country = addr?.country ?? addr?.country_code ?? '—'
                    const statusKey = order.status ?? 'pending'
                    const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString('ar-AE') : '—'
                    return (
                      <tr key={order.id} className={`border-b border-gray-50 hover:bg-pink-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-4 py-3 font-mono text-[#F50057] font-semibold text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[statusKey] ?? 'bg-gray-100 text-gray-700'}`}>{STATUS_AR[statusKey] ?? statusKey}</span></td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{order.currency ?? 'AED'} {parseFloat(String(order.total ?? 0)).toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{order.payment_method ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{country}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{dateStr}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {topCountries.length === 0 ? <EmptyState message="لا توجد طلبات بعد — توزيع الدول سيظهر هنا" /> : (
              <div className="space-y-4">
                {topCountries.map(c => (
                  <div key={c.name} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1"><span className="text-sm font-medium text-gray-800">{c.name}</span><span className="text-sm text-gray-500">{c.orders} طلب</span></div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-l from-pink-400 to-[#F50057] rounded-full" style={{ width: `${Math.round((c.orders / maxCountryOrders) * 100)}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {lowStock.length === 0 ? <EmptyState message="لا توجد تنبيهات مخزون — كل المخزون كافٍ" /> : (
              <div className="space-y-3">
                {lowStock.map(item => (
                  <div key={item.product_id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div><p className="font-medium text-gray-900 text-sm">SKU: {item.sku ?? item.product_id.slice(0, 12)}</p>{item.warehouse_location && <p className="text-xs text-gray-500 mt-0.5">📍 {item.warehouse_location}</p>}</div>
                    <div className="text-left"><span className="text-red-600 font-bold text-xl">{item.available_quantity}</span><p className="text-xs text-gray-400">/ حد التنبيه: {item.low_stock_threshold}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-10">البيانات من Supabase (kjufpqkobsicqatmodvl) · {kpis.shopifyProductsCount} منتج Shopify</p>
      </main>
    </div>
  )
}
