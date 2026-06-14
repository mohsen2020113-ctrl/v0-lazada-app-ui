'use client'

import { useState, useEffect, useCallback } from 'react'

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

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  compare_price: '',
  inventory: '',
  product_type: '',
  vendor: '4LEEE',
  image_url: '',
  tags: '',
  status: 'active',
}

export default function AdminUI({ data }: { data: AdminData }) {
  const [tab, setTab] = useState<'products' | 'orders' | 'users' | 'inventory'>('products')

  // Products CRUD state
  const [shopifyProducts, setShopifyProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warn' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [tokenMissing, setTokenMissing] = useState(false)

  const showToast = (msg: string, type: 'success' | 'error' | 'warn') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true)
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' })
      const json = await res.json()
      if (json.error) {
        if (json.error.includes('SHOPIFY_ADMIN_API_TOKEN')) {
          setTokenMissing(true)
        } else {
          showToast('خطأ في تحميل المنتجات: ' + json.error, 'error')
        }
        setShopifyProducts([])
      } else {
        setTokenMissing(false)
        setShopifyProducts(json.products || [])
      }
    } catch {
      showToast('فشل الاتصال بالخادم', 'error')
    } finally {
      setProductsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'products') fetchProducts()
  }, [tab, fetchProducts])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.price) {
      showToast('العنوان والسعر مطلوبان', 'error')
      return
    }
    setFormLoading(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (json.error) {
        if (json.error.includes('SHOPIFY_ADMIN_API_TOKEN')) {
          setTokenMissing(true)
          showToast('SHOPIFY_ADMIN_API_TOKEN غير مضبوط', 'warn')
        } else {
          showToast('خطأ: ' + json.error, 'error')
        }
      } else {
        showToast('✅ تم إضافة المنتج بنجاح — سيظهر على الويب والتطبيق فوراً', 'success')
        setForm({ ...EMPTY_FORM })
        fetchProducts()
      }
    } catch {
      showToast('فشل الاتصال بالخادم', 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل تريد حذف "${title}"؟`)) return
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (json.error) {
        showToast('خطأ في الحذف: ' + json.error, 'error')
      } else {
        showToast('🗑️ تم حذف المنتج', 'success')
        fetchProducts()
      }
    } catch {
      showToast('فشل الاتصال بالخادم', 'error')
    }
  }

  const startEdit = (p: any) => {
    setEditingId(String(p.id))
    setEditForm({
      title: p.title || '',
      body_html: p.body_html || '',
      vendor: p.vendor || '4LEEE',
      product_type: p.product_type || '',
      status: p.status || 'active',
      tags: p.tags || '',
    })
  }

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      })
      const json = await res.json()
      if (json.error) {
        showToast('خطأ في التعديل: ' + json.error, 'error')
      } else {
        showToast('✏️ تم تحديث المنتج', 'success')
        setEditingId(null)
        fetchProducts()
      }
    } catch {
      showToast('فشل الاتصال بالخادم', 'error')
    }
  }

  const lowStock = data.inventory.filter(
    (i) => i.available_quantity < (i.low_stock_threshold ?? 5)
  ).length

  const tabs = [
    { key: 'products',  label: 'المنتجات',   count: shopifyProducts.length || data.products.length },
    { key: 'orders',    label: 'الطلبات',    count: data.orders.length },
    { key: 'users',     label: 'المستخدمون', count: data.profiles.length },
    { key: 'inventory', label: 'المخزون',    count: data.inventory.length },
  ] as const

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300'

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium max-w-sm
          ${toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'warn'    ? 'bg-yellow-400 text-gray-900' :
                                       'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

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
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">← الموقع</a>
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
            <p className="text-3xl font-bold text-green-600">{shopifyProducts.length || data.products.length}</p>
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

            {/* ============ PRODUCTS TAB ============ */}
            {tab === 'products' && (
              <div className="space-y-8">

                {/* Token missing warning */}
                {tokenMissing && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
                    <p className="font-semibold mb-1">⚠️ للإضافة المباشرة، أضف SHOPIFY_ADMIN_API_TOKEN في Vercel</p>
                    <p>اذهب إلى: Shopify Admin → التطبيقات → تطوير التطبيقات → أنشئ تطبيقاً خاصاً</p>
                  </div>
                )}

                {/* ADD PRODUCT FORM */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-base font-semibold text-gray-800 mb-5">إضافة منتج جديد</h2>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">عنوان المنتج *</label>
                      <input className={inputCls} placeholder="مثال: حذاء رياضي نايك" required
                        value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">الوصف</label>
                      <textarea className={inputCls} rows={3} placeholder="وصف المنتج..."
                        value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">السعر (AED) *</label>
                      <input className={inputCls} type="number" min="0" step="0.01" placeholder="0.00" required
                        value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">السعر الأصلي (قبل الخصم)</label>
                      <input className={inputCls} type="number" min="0" step="0.01" placeholder="0.00"
                        value={form.compare_price} onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">الكمية في المخزون</label>
                      <input className={inputCls} type="number" min="0" placeholder="0"
                        value={form.inventory} onChange={e => setForm(f => ({ ...f, inventory: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">نوع المنتج</label>
                      <input className={inputCls} placeholder="مثال: أحذية"
                        value={form.product_type} onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">البائع</label>
                      <input className={inputCls} placeholder="4LEEE"
                        value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">الحالة</label>
                      <select className={inputCls}
                        value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="active">نشط</option>
                        <option value="draft">مسودة</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">رابط الصورة</label>
                      <input className={inputCls} placeholder="https://..."
                        value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">الوسوم / Tags (مفصولة بفاصلة)</label>
                      <input className={inputCls} placeholder="موضة، رياضة، عروض"
                        value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <button type="submit" disabled={formLoading}
                        className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: '#F50057' }}>
                        {formLoading ? 'جارٍ الإضافة...' : 'إضافة إلى Shopify →'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* PRODUCTS TABLE */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-800">
                      منتجات Shopify ({shopifyProducts.length})
                    </h2>
                    <button onClick={fetchProducts} disabled={productsLoading}
                      className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                      {productsLoading ? '...' : '🔄 تحديث'}
                    </button>
                  </div>

                  {productsLoading ? (
                    <div className="text-center py-10 text-gray-400 text-sm">جارٍ التحميل...</div>
                  ) : shopifyProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                      {tokenMissing ? 'أضف SHOPIFY_ADMIN_API_TOKEN لعرض المنتجات' : 'لا توجد منتجات'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-right py-3 px-2 text-gray-500 font-medium">الصورة</th>
                            <th className="text-right py-3 px-2 text-gray-500 font-medium">العنوان</th>
                            <th className="text-right py-3 px-2 text-gray-500 font-medium">السعر</th>
                            <th className="text-right py-3 px-2 text-gray-500 font-medium">الحالة</th>
                            <th className="text-right py-3 px-2 text-gray-500 font-medium">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shopifyProducts.map((p: any) => (
                            <>
                              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-2">
                                  {p.image?.src ? (
                                    <img src={p.image.src} alt={p.title}
                                      className="w-10 h-10 object-cover rounded-lg" />
                                  ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">📦</div>
                                  )}
                                </td>
                                <td className="py-3 px-2 text-gray-800 font-medium max-w-[200px] truncate">{p.title}</td>
                                <td className="py-3 px-2 text-gray-700">
                                  {p.variants?.[0]?.price
                                    ? `${p.variants[0].price} AED`
                                    : '—'}
                                  {p.variants?.[0]?.compare_at_price && (
                                    <span className="line-through text-gray-400 text-xs mr-1">
                                      {p.variants[0].compare_at_price}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-2">
                                  {p.status === 'active' ? (
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">نشط</span>
                                  ) : (
                                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">مسودة</span>
                                  )}
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex gap-2">
                                    <button onClick={() => startEdit(p)}
                                      className="text-xs px-3 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                                      تعديل
                                    </button>
                                    <button onClick={() => handleDelete(String(p.id), p.title)}
                                      className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                                      حذف
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {/* Inline edit row */}
                              {editingId === String(p.id) && (
                                <tr key={`edit-${p.id}`} className="bg-blue-50 border-b border-blue-100">
                                  <td colSpan={5} className="px-4 py-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">العنوان</label>
                                        <input className={inputCls} value={editForm.title || ''}
                                          onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">البائع</label>
                                        <input className={inputCls} value={editForm.vendor || ''}
                                          onChange={e => setEditForm(f => ({ ...f, vendor: e.target.value }))} />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">نوع المنتج</label>
                                        <input className={inputCls} value={editForm.product_type || ''}
                                          onChange={e => setEditForm(f => ({ ...f, product_type: e.target.value }))} />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">الحالة</label>
                                        <select className={inputCls} value={editForm.status || 'active'}
                                          onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                                          <option value="active">نشط</option>
                                          <option value="draft">مسودة</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">الوسوم</label>
                                        <input className={inputCls} value={editForm.tags || ''}
                                          onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))} />
                                      </div>
                                      <div className="flex items-end gap-2">
                                        <button onClick={() => handleSaveEdit(String(p.id))}
                                          className="flex-1 py-2 rounded-xl text-white text-sm font-medium"
                                          style={{ backgroundColor: '#F50057' }}>
                                          حفظ
                                        </button>
                                        <button onClick={() => setEditingId(null)}
                                          className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm">
                                          إلغاء
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============ ORDERS TAB ============ */}
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

            {/* ============ USERS TAB ============ */}
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

            {/* ============ INVENTORY TAB ============ */}
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
