'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard, ShoppingCart, Package, Users, Sparkles, Palette,
  Megaphone, Store, UserCog, DollarSign, Monitor, ShoppingBag,
  Shield, Settings, ChevronDown, ChevronRight, Bell, Search,
  TrendingUp, TrendingDown, ArrowUpRight, RefreshCw, Plus, Trash2,
  Edit2, Check, X, Eye, EyeOff, ToggleLeft, ToggleRight, Download,
  Upload, Filter, MoreHorizontal, AlertCircle, CheckCircle2,
  Clock, Truck, Ban, RotateCcw, Globe, Smartphone, Server,
  Cpu, Database, Lock, Key, Activity, FileText, BarChart2,
  PieChart, Zap, Bot, Brain, Target, Mail, MessageSquare,
  Instagram, Tag, Percent, Gift, Send, Layers, Image, Video,
  Link, Box, Warehouse, Map, CreditCard, Receipt, Wallet,
  Calendar, UserPlus, LogOut, Info, ExternalLink, Copy,
  ChevronLeft, Menu, XCircle
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart as RechartsPie, Pie, Cell } from 'recharts'

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Section =
  | 'dashboard' | 'orders' | 'products' | 'customers' | 'ai'
  | 'design' | 'marketing' | 'marketplace' | 'employees' | 'finance'
  | 'platform' | 'shopify' | 'security' | 'settings'

interface AdminData { orders: any[]; profiles: any[]; inventory: any[]; products: any[] }

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const REVENUE_DATA = [
  { d: 'Jan', rev: 12400, profit: 4200 }, { d: 'Feb', rev: 18200, profit: 6100 },
  { d: 'Mar', rev: 15800, profit: 5400 }, { d: 'Apr', rev: 22100, profit: 8200 },
  { d: 'May', rev: 19400, profit: 7100 }, { d: 'Jun', rev: 28900, profit: 11200 },
]
const ORDER_STATUS_DATA = [
  { name: 'مُسلَّم', value: 42, color: '#22c55e' },
  { name: 'قيد الشحن', value: 28, color: '#3b82f6' },
  { name: 'معالجة', value: 18, color: '#f59e0b' },
  { name: 'ملغي', value: 12, color: '#ef4444' },
]
const MOCK_ORDERS = [
  { id: '#4521', customer: 'أحمد الزهراني', total: 'AED 389', status: 'delivered', date: '2026-06-15', items: 3 },
  { id: '#4520', customer: 'فاطمة العمري', total: 'AED 129', status: 'shipped', date: '2026-06-14', items: 1 },
  { id: '#4519', customer: 'محمد العسيري', total: 'AED 749', status: 'processing', date: '2026-06-14', items: 5 },
  { id: '#4518', customer: 'نورة القحطاني', total: 'AED 215', status: 'pending', date: '2026-06-13', items: 2 },
  { id: '#4517', customer: 'عبدالله الشهري', total: 'AED 980', status: 'delivered', date: '2026-06-13', items: 4 },
  { id: '#4516', customer: 'سارة المالكي', total: 'AED 67', status: 'cancelled', date: '2026-06-12', items: 1 },
]
const MOCK_PRODUCTS = [
  { id: 'p1', name: 'سماعة 4LEEE Ultra Pro', category: 'إلكترونيات', price: 299, stock: 145, status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop' },
  { id: 'p2', name: 'ساعة ذكية ProSeries X', category: 'إلكترونيات', price: 549, stock: 88, status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop' },
  { id: 'p3', name: 'حقيبة سفر Titan 28"', category: 'حقائب', price: 189, stock: 0, status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=60&h=60&fit=crop' },
  { id: 'p4', name: 'كاميرا Mirrorless Z6', category: 'إلكترونيات', price: 3200, stock: 22, status: 'active', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=60&h=60&fit=crop' },
  { id: 'p5', name: 'عطر Noir Élite 100ml', category: 'عناية', price: 145, stock: 210, status: 'active', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=60&h=60&fit=crop' },
]
const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'أحمد الزهراني', email: 'ahmed@email.com', orders: 12, spent: 'AED 4,280', status: 'VIP', joined: '2025-01-10' },
  { id: 'c2', name: 'فاطمة العمري', email: 'fatima@email.com', orders: 8, spent: 'AED 1,920', status: 'Regular', joined: '2025-03-22' },
  { id: 'c3', name: 'محمد العسيري', email: 'mohammed@email.com', orders: 31, spent: 'AED 11,450', status: 'VIP', joined: '2024-11-05' },
  { id: 'c4', name: 'نورة القحطاني', email: 'noura@email.com', orders: 3, spent: 'AED 645', status: 'New', joined: '2026-05-18' },
]
const MOCK_EMPLOYEES = [
  { id: 'e1', name: 'م. فهد الزهراني', role: 'Admin', dept: 'تقنية المعلومات', email: 'fahad@4leee.com', status: 'active' },
  { id: 'e2', name: 'هند الماجد', role: 'Manager', dept: 'العمليات اللوجستية', email: 'hind@4leee.com', status: 'active' },
  { id: 'e3', name: 'سلطان الغامدي', role: 'Support', dept: 'خدمة العملاء', email: 'sultan@4leee.com', status: 'active' },
]
const AI_AGENTS = [
  { name: 'وكيل المنتجات', icon: Package, status: 'active', tasks: 128, desc: 'تحسين الأسعار وإدارة الكتالوج' },
  { name: 'وكيل التسويق', icon: Megaphone, status: 'active', tasks: 94, desc: 'إنشاء الحملات والمحتوى' },
  { name: 'وكيل المالية', icon: DollarSign, status: 'active', tasks: 57, desc: 'تحليل الأرباح والتوقعات' },
  { name: 'وكيل العملاء', icon: Users, status: 'idle', tasks: 23, desc: 'تحليل السلوك وتوصيات CRM' },
  { name: 'وكيل SEO', icon: Target, status: 'active', tasks: 76, desc: 'تحسين محركات البحث' },
  { name: 'وكيل الأمن', icon: Shield, status: 'active', tasks: 12, desc: 'مراقبة التهديدات والإشعارات' },
]

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  shipped:   'bg-blue-100 text-blue-700',
  processing:'bg-yellow-100 text-yellow-700',
  pending:   'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
  active:    'bg-green-100 text-green-700',
  out_of_stock:'bg-red-100 text-red-700',
  VIP:       'bg-purple-100 text-purple-700',
  Regular:   'bg-blue-100 text-blue-700',
  New:       'bg-gray-100 text-gray-600',
}
const STATUS_LABEL: Record<string, string> = {
  delivered:'مُسلَّم', shipped:'قيد الشحن', processing:'معالجة',
  pending:'انتظار', cancelled:'ملغي', active:'نشط', out_of_stock:'نفد',
  VIP:'VIP', Regular:'عادي', New:'جديد'
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function KPICard({ label, value, sub, icon: Icon, trend, color = 'blue' }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(trend)}% مقارنة بالشهر الماضي</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}

function Badge({ status }: { status: string }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABEL[status] || status}
    </span>
  )
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── SECTIONS ──────────────────────────────────────────────────────────────────

function DashboardSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="لوحة التحكم الرئيسية" subtitle="نظرة عامة على أداء المنصة في امواق الىقت الفعلي'" />

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="إيرادات اليوم" value="AED 4,280" sub="23 طلب مكتمل" icon={DollarSign} trend={12} color="green" />
        <KPICard label="إيرادات الشهر" value="AED 89,420" sub="هدف: AED 120K" icon={TrendingUp} trend={8} color="blue" />
        <KPICard label="صافي الربح" value="AED 28,140" sub="هامش 31.5%" icon={BarChart2} trend={5} color="purple" />
        <KPICard label="الطلبات النشطة" value="147" sub="18 تحتاج مراجعة" icon={ShoppingCart} trend={-3} color="orange" />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="إجمالي المنتجات" value="50" sub="3 نفدت من المخزن" icon={Package} color="blue" />
        <KPICard label="العملاء المسجلون" value="0" sub="المتجر جديد" icon={Users} color="purple" />
        <KPICard label="الموردون النشطون" value="4" sub="2 دروبشيبنج" icon={Store} color="orange" />
        <KPICard label="مهام الذكاء املشطلاعي" value="390" sub="6 وكلاء نشطون" icon={Bot} color="green" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">الإيرادات والأرباح (2026)</h3>
          <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
            <option>آخر 6 أشهر</option>
            <option>هذا العام</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={REVENUE_DATA}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="d" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Area type="monotone" dataKey="rev" stroke="#3b82f6" fill="url(#rev)" strokeWidth={2} name="الإيرادات" />
            <Area type="monotone" dataKey="profit" stroke="#22c55e" fill="url(#prof)" strokeWidth={2} name="الربح" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">أحدث الطلبات</h3>
          <div className="space-y-3">
            {MOCK_ORDERS.slice(0, 4).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.id} • {o.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={o.status} />
                  <span className="text-sm font-bold text-gray-900">{o.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">حالة المنصة</h3>
          <div className="space-y-3">
            {[
              { label: 'امموقع الإلكتروني', status: true },
              { label: 'تطبيق Android', status: true },
              { label: 'تطبيق iPhone', status: true },
              { label: 'Shopify Sync', status: true },
              { label: 'نظام الذكاء الاصطناعي', status: true },
              { label: 'CDN & Storage', status: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{s.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${s.status ? 'bg-green-500' : 'bg-red-500'} ${s.status ? 'animate-pulse' : ''}`} />
                  <span className={`text-xs font-semibold ${s.status ? 'text-green-600' : 'text-red-500'}`}>
                    {s.status ? 'يعمل' : 'متوقف'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrdersSection() {
  const [filter, setFilter] = useState('all')
  const tabs = [
    { key: 'all', label: 'الكل', count: 147 }, { key: 'pending', label: 'انتظار', count: 18 },
    { key: 'processing', label: 'معالجة', count: 31 }, { key: 'shipped', label: 'شحن', count: 45 },
    { key: 'delivered', label: 'مُسلَّم', count: 42 }, { key: 'cancelled', label: 'ملغي', count: 11 },
  ]
  const filtered = filter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter)
  return (
    <div className="space-y-6">
      <SectionHeader
        title="إدارة الطلبات"
        subtitle="جميع الطلبات الواردة عبر القنوات المختلفة"
        action={
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> طلب جديد
          </button>
        }
      />
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === t.key ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === t.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>
      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">رقم الطلب</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">العميل</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">التاريخ</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">العناصر</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">المبلغ</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الحالة</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-bold text-blue-600">{o.id}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{o.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{o.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{o.items} منتجات</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">{o.total}</td>
                <td className="px-4 py-3"><Badge status={o.status} /></td>
                <td className="px-4 py-3">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">لا توجد طلبات في هذه الفئة</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductsSection() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [showForm, setShowForm] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'إلكترونيات', price: '', stock: '' })

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' })
      const json = await res.json()
      if (json.products) {
        const mapped = json.products.map((p: any) => ({
          id: p.id, name: p.title, category: p.product_type || 'عام',
          price: p.variants?.[0]?.price || 0,
          stock: p.variants?.[0]?.inventory_quantity ?? '—',
          status: p.status === 'active' ? 'active' : 'out_of_stock',
          image: p.image?.src || '',
        }))
        setProducts(mapped)
      }
    } catch { /* use mock */ }
    finally { setSyncing(false) }
  }

  const toggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id
      ? { ...p, status: p.status === 'active' ? 'out_of_stock' : 'active' }
      : p
    ))
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="المنتجات والمخزون"
        subtitle="إدارة الكتالوج الكامل للمنتجات ومزامنة Shopify"
        action={
          <div className="flex gap-2">
            <button onClick={handleSync} disabled={syncing}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'مزامنة...' : 'مزامنة Shopify'}
            </button>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> منتج جديد
            </button>
          </div>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">إضافة منتج جديد</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">اسم المنتج</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اسم المنتج..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">الفئة</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['إلكترونيات', 'حقائب', 'عناية', 'ملابس', 'أثاث'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">السعر (AED)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">الكمية</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">حفظ المنتج</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium">إلغاء</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">المنتج</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الفئة</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">السعر</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">المخزون</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الحالة</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.category}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">AED {p.price}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.stock}</td>
                <td className="px-4 py-3"><Badge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(p.id)} className="text-gray-400 hover:text-blue-600 transition-colors">
                      {p.status === 'active' ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CustomersSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="إدارة العملاء"
        subtitle="ملفات العملاء، المجموعات، وتحميلات CRM"
        action={
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            <UserPlus className="w-4 h-4" /> إضافة عميل
          </button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="إجمالي العملاء" value="0" sub="اممتجر جديد" icon={Users} color="blue" />
        <KPICard label="عملا֡ VIP" value="0" sub="+0 هذا الشهر" icon={Sparkles} color="purple" />
        <KPICard label="متوسط الإنفاق" value="AED 0" sub="لكل عميل" icon={DollarSign} color="green" />
        <KPICard label="معدل الاحتفاظ" value="—" sub="لا بيانات بعد" icon={RotateCcw} color="orange" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">العميل</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">البريد</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الطلبات</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الإنفاق الكلي</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">الفئة</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CUSTOMERS.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {c.name[0]}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{c.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{c.orders}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">{c.spent}</td>
                <td className="px-4 py-3"><Badge status={c.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-400">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AICenterSection() {
  const [autonomousMode, setAutonomousMode] = useState<'off' | 'assisted' | 'full'>('assisted')
  return (
    <div className="space-y-6">
      <SectionHeader title="مركز الذكاء الاصطناعي" subtitle="إدارة الوكلاء الذكيين والنظام التشغيلي" />

      {/* Autonomous Mode */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600" /> وضع التشغيل التمقائي
            </h3>
            <p className="text-sm text-gray-500 mt-1">تحكم في مستوى استقلالية الذكاء الاصطناضي</p>
          </div>
          <div className="flex gap-2">
            {(['off', 'assisted', 'full'] as const).map(m => (
              <button key={m}
                onClick={() => setAutonomousMode(m)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  autonomousMode === m
                    ? m === 'off' ? 'bg-gray-600 text-white' : m === 'assisted' ? 'bg-blue-600 text-white' : 'bg-violet-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                {m === 'off' ? '⛔ إيقاف' : m === 'assisted' ? 'ð¤ مساعدة' : 'ð تلقائي كامل'}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 p-3 bg-white/70 rounded-lg">
          <p className="text-xs text-gray-600">
            {autonomousMode === 'off' && 'ð´ الذكاء الاصطناعي في وضع المراقبة فقط — لا يتَذد قراËرات.'}
            {autonomousMode === 'assisted' && 'ð¡ الذكاء الاصطناعي ييترح، والمالك يوافق على كل إجراء.'}
            {autonomousMode === 'full' && 'ð¢ الذكاء الاصطناعي يتحكم بـ 95% من العمميات تلقائياً. إجراءات الحذف تتطلب موافقتك دائماً.'}
          </p>
        </div>
      </div>

      {/* AI CEO Report */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500" /> تقريز المدير التمفيذي (
