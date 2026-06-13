'use client'

import { useState } from 'react'

interface AdminData {
  orders: any[]
  profiles: any[]
  inventory: any[]
  products: any[]
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800' },
  shipped:    { label: 'تم الشحن',     color: 'bg-indigo-100 text-indigo-800' },
  delivered:  { label: 'تم التسليم',   color: 'bg-green-100 text-green-800' },
  cancelled:  { label: 'ملغي',          color: 'bg-red-100 text-red-800' },
}

export default function AdminUI({ data }: { data: AdminData }) {
  const [tab, setTab] = useState<'products' | 'orders' | 'users' | 'inventory'>('products')

  const lowStock = data.inventory.filter(
    (i) => i.available_quantity < (i.low_stock_threshold ?? 5)
  ).length

  const tabs = [
    { key: 'products',  label: 'المنتجات',              count: data.products.length },
    { key: 'orders',    label: 'الطلبات',               count: data.orders.length },
    { key: 'users',     label: 'المستخدمون',            count: data.profiles.length },
    { key: 'inventory', label: 'المخزون',               count: data.inventory.length },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#F50057' }}>
              4
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">لوحة الإدارة</h1>
              <p className="text-xs text-green-600 font-medium">
                ● مباشر — التغييرات تظهر فوراً على الويب والتطبيق
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              ← الموقع
            </a>
            <a href="/dashboard"
              className="px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#F50057' }}>
              📊 الإحصائيات
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">إجمالي المنتجات</p>
            <p className="text-3xl font-bold text-green-600">{data.products.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">إجمالي الطلبات</p>
            <p className="text-3xl font-bold text-blue-600">{data.orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">إجمالي المستخدمين</p>
            <p className="text-3xl font-bold text-orange-500">{data.profiles.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">مخزون منخفض</p>
            <p className="text-3xl font-bold text-red-500">{lowStock}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  tab === t.key
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={tab === t.key ? { borderBottomColor: '#F50057', color: '#F50057' } : {}}
              >
                {t.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tab === t.key ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-500'
                }`}
                  style={tab === t.key ? { backgroundColor: '#fff0f6', color: '#F50057' } : {}}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {tab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">منتجات Shopify</h2>
                  <a
                    href="https://admin.shopify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#F50057' }}
                  >
                    + إضافة منتج في Shopify
                  </a>
                </div>
                {data.products.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">لا توجد منتجات</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">الرابط</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">الاسم</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">السعر</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.products.map((p: any) => (
                          <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2 text-gray-400 font-mono text-xs">{p.handle}</td>
                            <td className="py-3 px-2 text-gray-800 font-medium">{p.title}</td>
                            <td className="py-3 px-2 text-gray-700">
                              {p.priceRange?.minVariantPrice?.amount ?? '—'}{' '}
                              <span className="text-gray-400 text-xs">{p.priceRange?.minVariantPrice?.currencyCode}</span>
                            </td>
                            <td className="py-3 px-2">
                              {p.availableForSale ? (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">متاح</span>
                              ) : (
                                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">غير متاح</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">الطلبات</h2>
                {data.orders.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">لا توجد طلبات بعد</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">رقم الطلب</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">الحالة</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">الإجمالي</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">العملة</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">التاريخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.orders.map((o: any) => {
                          const statusInfo = STATUS_LABELS[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-600' }
                          return (
                            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-2 font-mono text-xs text-gray-500">{String(o.id).slice(0, 8)}</td>
                              <td className="py-3 px-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-gray-800 font-medium">{o.total_amount ?? o.total ?? '—'}</td>
                              <td className="py-3 px-2 text-gray-500">{o.currency ?? '—'}</td>
                              <td className="py-3 px-2 text-gray-400 text-xs">
                                {o.created_at ? new Date(o.created_at).toLocaleDateString('ar-EG') : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {tab === 'users' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  المستخدمون ({data.profiles.length})
                </h2>
                {data.profiles.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">لا يوجد مستخدمون بعد</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">المستخدم</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">البريد الإلكتروني</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">تاريخ الانضمام</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.profiles.map((u: any) => (
                          <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                  style={{ backgroundColor: '#F50057' }}>
                                  {(u.full_name ?? u.email ?? 'م')[0].toUpperCase()}
                                </div>
                                <span className="text-gray-800">{u.full_name ?? 'مستخدم'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-500">{u.email ?? '—'}</td>
                            <td className="py-3 px-2 text-gray-400 text-xs">
                              {u.created_at ? new Date(u.created_at).toLocaleDateString('ar-EG') : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {tab === 'inventory' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">المخزون</h2>
                {data.inventory.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">لا توجد بيانات مخزون</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">SKU</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">الكمية</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">المتاح</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">حد التنبيه</th>
                          <th className="text-right py-3 px-2 text-gray-500 font-medium">الموقع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.inventory.map((item: any, idx: number) => {
                          const isLow = item.available_quantity < (item.low_stock_threshold ?? 5)
                          return (
                            <tr key={item.id ?? idx}
                              className={`border-b hover:opacity-90 transition-opacity ${isLow ? 'bg-red-50' : 'border-gray-50'}`}>
                              <td className="py-3 px-2 font-mono text-xs text-gray-600">{item.sku ?? '—'}</td>
                              <td className="py-3 px-2 text-gray-800">{item.quantity ?? '—'}</td>
                              <td className={`py-3 px-2 font-semibold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                                {item.available_quantity ?? '—'}
                              </td>
                              <td className="py-3 px-2 text-gray-500">{item.low_stock_threshold ?? '—'}</td>
                              <td className="py-3 px-2 text-gray-500">{item.warehouse_location ?? '—'}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
