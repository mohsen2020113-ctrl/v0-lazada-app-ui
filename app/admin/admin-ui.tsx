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

// âââ TYPES ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
type Section =
  | 'dashboard' | 'orders' | 'products' | 'customers' | 'ai'
  | 'design' | 'marketing' | 'marketplace' | 'employees' | 'finance'
  | 'platform' | 'shopify' | 'security' | 'settings'

interface AdminData { orders: any[]; profiles: any[]; inventory: any[]; products: any[] }

// âââ MOCK DATA âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const REVENUE_DATA = [
  { d: 'Jan', rev: 12400, profit: 4200 }, { d: 'Feb', rev: 18200, profit: 6100 },
  { d: 'Mar', rev: 15800, profit: 5400 }, { d: 'Apr', rev: 22100, profit: 8200 },
  { d: 'May', rev: 19400, profit: 7100 }, { d: 'Jun', rev: 28900, profit: 11200 },
]
const ORDER_STATUS_DATA = [
  { name: 'ÙÙØ³ÙÙÙÙ', value: 42, color: '#22c55e' },
  { name: 'ÙÙØ¯ Ø§ÙØ´Ø­Ù', value: 28, color: '#3b82f6' },
  { name: 'ÙØ¹Ø§ÙØ¬Ø©', value: 18, color: '#f59e0b' },
  { name: 'ÙÙØºÙ', value: 12, color: '#ef4444' },
]
const MOCK_ORDERS = [
  { id: '#4521', customer: 'Ø£Ø­ÙØ¯ Ø§ÙØ²ÙØ±Ø§ÙÙ', total: 'AED 389', status: 'delivered', date: '2026-06-15', items: 3 },
  { id: '#4520', customer: 'ÙØ§Ø·ÙØ© Ø§ÙØ¹ÙØ±Ù', total: 'AED 129', status: 'shipped', date: '2026-06-14', items: 1 },
  { id: '#4519', customer: 'ÙØ­ÙØ¯ Ø§ÙØ¹Ø³ÙØ±Ù', total: 'AED 749', status: 'processing', date: '2026-06-14', items: 5 },
  { id: '#4518', customer: 'ÙÙØ±Ø© Ø§ÙÙØ­Ø·Ø§ÙÙ', total: 'AED 215', status: 'pending', date: '2026-06-13', items: 2 },
  { id: '#4517', customer: 'Ø¹Ø¨Ø¯Ø§ÙÙÙ Ø§ÙØ´ÙØ±Ù', total: 'AED 980', status: 'delivered', date: '2026-06-13', items: 4 },
  { id: '#4516', customer: 'Ø³Ø§Ø±Ø© Ø§ÙÙØ§ÙÙÙ', total: 'AED 67', status: 'cancelled', date: '2026-06-12', items: 1 },
]
const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Ø³ÙØ§Ø¹Ø© 4LEEE Ultra Pro', category: 'Ø¥ÙÙØªØ±ÙÙÙØ§Øª', price: 299, stock: 145, status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop' },
  { id: 'p2', name: 'Ø³Ø§Ø¹Ø© Ø°ÙÙØ© ProSeries X', category: 'Ø¥ÙÙØªØ±ÙÙÙØ§Øª', price: 549, stock: 88, status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop' },
  { id: 'p3', name: 'Ø­ÙÙØ¨Ø© Ø³ÙØ± Titan 28"', category: 'Ø­ÙØ§Ø¦Ø¨', price: 189, stock: 0, status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=60&h=60&fit=crop' },
  { id: 'p4', name: 'ÙØ§ÙÙØ±Ø§ Mirrorless Z6', category: 'Ø¥ÙÙØªØ±ÙÙÙØ§Øª', price: 3200, stock: 22, status: 'active', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=60&h=60&fit=crop' },
  { id: 'p5', name: 'Ø¹Ø·Ø± Noir Ãlite 100ml', category: 'Ø¹ÙØ§ÙØ©', price: 145, stock: 210, status: 'active', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=60&h=60&fit=crop' },
]
const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Ø£Ø­ÙØ¯ Ø§ÙØ²ÙØ±Ø§ÙÙ', email: 'ahmed@email.com', orders: 12, spent: 'AED 4,280', status: 'VIP', joined: '2025-01-10' },
  { id: 'c2', name: 'ÙØ§Ø·ÙØ© Ø§ÙØ¹ÙØ±Ù', email: 'fatima@email.com', orders: 8, spent: 'AED 1,920', status: 'Regular', joined: '2025-03-22' },
  { id: 'c3', name: 'ÙØ­ÙØ¯ Ø§ÙØ¹Ø³ÙØ±Ù', email: 'mohammed@email.com', orders: 31, spent: 'AED 11,450', status: 'VIP', joined: '2024-11-05' },
  { id: 'c4', name: 'ÙÙØ±Ø© Ø§ÙÙØ­Ø·Ø§ÙÙ', email: 'noura@email.com', orders: 3, spent: 'AED 645', status: 'New', joined: '2026-05-18' },
]
const MOCK_EMPLOYEES = [
  { id: 'e1', name: 'Ù. ÙÙØ¯ Ø§ÙØ²ÙØ±Ø§ÙÙ', role: 'Admin', dept: 'ØªÙÙÙØ© Ø§ÙÙØ¹ÙÙÙØ§Øª', email: 'fahad@4leee.com', status: 'active' },
  { id: 'e2', name: 'ÙÙØ¯ Ø§ÙÙØ§Ø¬Ø¯', role: 'Manager', dept: 'Ø§ÙØ¹ÙÙÙØ§Øª Ø§ÙÙÙØ¬Ø³ØªÙØ©', email: 'hind@4leee.com', status: 'active' },
  { id: 'e3', name: 'Ø³ÙØ·Ø§Ù Ø§ÙØºØ§ÙØ¯Ù', role: 'Support', dept: 'Ø®Ø¯ÙØ© Ø§ÙØ¹ÙÙØ§Ø¡', email: 'sultan@4leee.com', status: 'active' },
]
const AI_AGENTS = [
  { name: 'ÙÙÙÙ Ø§ÙÙÙØªØ¬Ø§Øª', icon: Package, status: 'active', tasks: 128, desc: 'ØªØ­Ø³ÙÙ Ø§ÙØ£Ø³Ø¹Ø§Ø± ÙØ¥Ø¯Ø§Ø±Ø© Ø§ÙÙØªØ§ÙÙØ¬' },
  { name: 'ÙÙÙÙ Ø§ÙØªØ³ÙÙÙ', icon: Megaphone, status: 'active', tasks: 94, desc: 'Ø¥ÙØ´Ø§Ø¡ Ø§ÙØ­ÙÙØ§Øª ÙØ§ÙÙØ­ØªÙÙ' },
  { name: 'ÙÙÙÙ Ø§ÙÙØ§ÙÙØ©', icon: DollarSign, status: 'active', tasks: 57, desc: 'ØªØ­ÙÙÙ Ø§ÙØ£Ø±Ø¨Ø§Ø­ ÙØ§ÙØªÙÙØ¹Ø§Øª' },
  { name: 'ÙÙÙÙ Ø§ÙØ¹ÙÙØ§Ø¡', icon: Users, status: 'idle', tasks: 23, desc: 'ØªØ­ÙÙÙ Ø§ÙØ³ÙÙÙ ÙØªÙØµÙØ§Øª CRM' },
  { name: 'ÙÙÙÙ SEO', icon: Target, status: 'active', tasks: 76, desc: 'ØªØ­Ø³ÙÙ ÙØ­Ø±ÙØ§Øª Ø§ÙØ¨Ø­Ø«' },
  { name: 'ÙÙÙÙ Ø§ÙØ£ÙÙ', icon: Shield, status: 'active', tasks: 12, desc: 'ÙØ±Ø§ÙØ¨Ø© Ø§ÙØªÙØ¯ÙØ¯Ø§Øª ÙØ§ÙØ¥Ø´Ø¹Ø§Ø±Ø§Øª' },
]

// âââ HELPERS âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
  delivered:'ÙÙØ³ÙÙÙÙ', shipped:'ÙÙØ¯ Ø§ÙØ´Ø­Ù', processing:'ÙØ¹Ø§ÙØ¬Ø©',
  pending:'Ø§ÙØªØ¸Ø§Ø±', cancelled:'ÙÙØºÙ', active:'ÙØ´Ø·', out_of_stock:'ÙÙØ¯',
  VIP:'VIP', Regular:'Ø¹Ø§Ø¯Ù', New:'Ø¬Ø¯ÙØ¯'
}

// âââ SUB-COMPONENTS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
            <span>{Math.abs(trend)}% ÙÙØ§Ø±ÙØ© Ø¨Ø§ÙØ´ÙØ± Ø§ÙÙØ§Ø¶Ù</span>
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

// âââ SECTIONS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function DashboardSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="ÙÙØ­Ø© Ø§ÙØªØ­ÙÙ Ø§ÙØ±Ø¦ÙØ³ÙØ©" subtitle="ÙØ¸Ø±Ø© Ø¹Ø§ÙØ© Ø¹ÙÙ Ø£Ø¯Ø§Ø¡ Ø§ÙÙÙØµØ© ÙÙ Ø§ÙÙØ§Ù Ø§ÙÙÙØª Ø§ÙÙØ¹ÙÙ'" />

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Ø¥ÙØ±Ø§Ø¯Ø§Øª Ø§ÙÙÙÙ" value="AED 4,280" sub="23 Ø·ÙØ¨ ÙÙØªÙÙ" icon={DollarSign} trend={12} color="green" />
        <KPICard label="Ø¥ÙØ±Ø§Ø¯Ø§Øª Ø§ÙØ´ÙØ±" value="AED 89,420" sub="ÙØ¯Ù: AED 120K" icon={TrendingUp} trend={8} color="blue" />
        <KPICard label="ØµØ§ÙÙ Ø§ÙØ±Ø¨Ø­" value="AED 28,140" sub="ÙØ§ÙØ´ 31.5%" icon={BarChart2} trend={5} color="purple" />
        <KPICard label="Ø§ÙØ·ÙØ¨Ø§Øª Ø§ÙÙØ´Ø·Ø©" value="147" sub="18 ØªØ­ØªØ§Ø¬ ÙØ±Ø§Ø¬Ø¹Ø©" icon={ShoppingCart} trend={-3} color="orange" />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Ø¥Ø¬ÙØ§ÙÙ Ø§ÙÙÙØªØ¬Ø§Øª" value="50" sub="3 ÙÙØ¯Øª ÙÙ Ø§ÙÙØ®Ø²Ù" icon={Package} color="blue" />
        <KPICard label="Ø§ÙØ¹ÙÙØ§Ø¡ Ø§ÙÙØ³Ø¬ÙÙÙ" value="0" sub="Ø§ÙÙØªØ¬Ø± Ø¬Ø¯ÙØ¯" icon={Users} color="purple" />
        <KPICard label="Ø§ÙÙÙØ±Ø¯ÙÙ Ø§ÙÙØ´Ø·ÙÙ" value="4" sub="2 Ø¯Ø±ÙØ¨Ø´ÙØ¨ÙØ¬" icon={Store} color="orange" />
        <KPICard label="ÙÙØ§Ù Ø§ÙØ°ÙØ§Ø¡ Ø§ÙÙØ´Ø·ÙØ§Ø¹Ù" value="390" sub="6 ÙÙÙØ§Ø¡ ÙØ´Ø·ÙÙ" icon={Bot} color="green" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Ø§ÙØ¥ÙØ±Ø§Ø¯Ø§Øª ÙØ§ÙØ£Ø±Ø¨Ø§Ø­ (2026)</h3>
          <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
            <option>Ø¢Ø®Ø± 6 Ø£Ø´ÙØ±</option>
            <option>ÙØ°Ø§ Ø§ÙØ¹Ø§Ù</option>
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
            <Area type="monotone" dataKey="rev" stroke="#3b82f6" fill="url(#rev)" strokeWidth={2} name="Ø§ÙØ¥ÙØ±Ø§Ø¯Ø§Øª" />
            <Area type="monotone" dataKey="profit" stroke="#22c55e" fill="url(#prof)" strokeWidth={2} name="Ø§ÙØ±Ø¨Ø­" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Ø£Ø­Ø¯Ø« Ø§ÙØ·ÙØ¨Ø§Øª</h3>
          <div className="space-y-3">
            {MOCK_ORDERS.slice(0, 4).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.id} â¢ {o.date}</p>
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
          <h3 className="font-bold text-gray-900 mb-4">Ø­Ø§ÙØ© Ø§ÙÙÙØµØ©</h3>
          <div className="space-y-3">
            {[
              { label: 'Ø§ÙÙÙÙØ¹ Ø§ÙØ¥ÙÙØªØ±ÙÙÙ', status: true },
              { label: 'ØªØ·Ø¨ÙÙ Android', status: true },
              { label: 'ØªØ·Ø¨ÙÙ iPhone', status: true },
              { label: 'Shopify Sync', status: true },
              { label: 'ÙØ¸Ø§Ù Ø§ÙØ°ÙØ§Ø¡ Ø§ÙØ§ØµØ·ÙØ§Ø¹Ù', status: true },
              { label: 'CDN & Storage', status: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{s.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${s.status ? 'bg-green-500' : 'bg-red-500'} ${s.status ? 'animate-pulse' : ''}`} />
                  <span className={`text-xs font-semibold ${s.status ? 'text-green-600' : 'text-red-500'}`}>
                    {s.status ? 'ÙØ¹ÙÙ' : 'ÙØªÙÙÙ'}
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
    { key: 'all', label: 'Ø§ÙÙÙ', count: 147 }, { key: 'pending', label: 'Ø§ÙØªØ¸Ø§Ø±', count: 18 },
    { key: 'processing', label: 'ÙØ¹Ø§ÙØ¬Ø©', count: 31 }, { key: 'shipped', label: 'Ø´Ø­Ù', count: 45 },
    { key: 'delivered', label: 'ÙÙØ³ÙÙÙÙ', count: 42 }, { key: 'cancelled', label: 'ÙÙØºÙ', count: 11 },
  ]
  const filtered = filter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter)
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Ø¥Ø¯Ø§Ø±Ø© Ø§ÙØ·ÙØ¨Ø§Øª"
        subtitle="Ø¬ÙÙØ¹ Ø§ÙØ·ÙØ¨Ø§Øª Ø§ÙÙØ§Ø±Ø¯Ø© Ø¹Ø¨Ø± Ø§ÙÙÙÙØ§Øª Ø§ÙÙØ®ØªÙÙØ©"
        action={
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Ø·ÙØ¨ Ø¬Ø¯ÙØ¯
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
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø±ÙÙ Ø§ÙØ·ÙØ¨</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ¹ÙÙÙ</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØªØ§Ø±ÙØ®</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ¹ÙØ§ØµØ±</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙÙØ¨ÙØº</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ­Ø§ÙØ©</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø¥Ø¬Ø±Ø§Ø¡</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-bold text-blue-600">{o.id}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{o.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{o.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{o.items} ÙÙØªØ¬Ø§Øª</td>
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
            <p className="text-sm">ÙØ§ ØªÙØ¬Ø¯ Ø·ÙØ¨Ø§Øª ÙÙ ÙØ°Ù Ø§ÙÙØ¦Ø©</p>
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
  const [form, setForm] = useState({ name: '', category: 'Ø¥ÙÙØªØ±ÙÙÙØ§Øª', price: '', stock: '' })

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' })
      const json = await res.json()
      if (json.products) {
        const mapped = json.products.map((p: any) => ({
          id: p.id, name: p.title, category: p.product_type || 'Ø¹Ø§Ù',
          price: p.variants?.[0]?.price || 0,
          stock: p.variants?.[0]?.inventory_quantity ?? 'â',
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
        title="Ø§ÙÙÙØªØ¬Ø§Øª ÙØ§ÙÙØ®Ø²ÙÙ"
        subtitle="Ø¥Ø¯Ø§Ø±Ø© Ø§ÙÙØªØ§ÙÙØ¬ Ø§ÙÙØ§ÙÙ ÙÙÙÙØªØ¬Ø§Øª ÙÙØ²Ø§ÙÙØ© Shopify"
        action={
          <div className="flex gap-2">
            <button onClick={handleSync} disabled={syncing}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'ÙØ²Ø§ÙÙØ©...' : 'ÙØ²Ø§ÙÙØ© Shopify'}
            </button>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> ÙÙØªØ¬ Ø¬Ø¯ÙØ¯
            </button>
          </div>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Ø¥Ø¶Ø§ÙØ© ÙÙØªØ¬ Ø¬Ø¯ÙØ¯</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Ø§Ø³Ù Ø§ÙÙÙØªØ¬</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ø§Ø³Ù Ø§ÙÙÙØªØ¬..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Ø§ÙÙØ¦Ø©</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Ø¥ÙÙØªØ±ÙÙÙØ§Øª', 'Ø­ÙØ§Ø¦Ø¨', 'Ø¹ÙØ§ÙØ©', 'ÙÙØ§Ø¨Ø³', 'Ø£Ø«Ø§Ø«'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Ø§ÙØ³Ø¹Ø± (AED)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Ø§ÙÙÙÙØ©</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Ø­ÙØ¸ Ø§ÙÙÙØªØ¬</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium">Ø¥ÙØºØ§Ø¡</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙÙÙØªØ¬</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙÙØ¦Ø©</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ³Ø¹Ø±</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙÙØ®Ø²ÙÙ</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ­Ø§ÙØ©</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª</th>
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
        title="Ø¥Ø¯Ø§Ø±Ø© Ø§ÙØ¹ÙÙØ§Ø¡"
        subtitle="ÙÙÙØ§Øª Ø§ÙØ¹ÙÙØ§Ø¡Ø Ø§ÙÙØ¬ÙÙØ¹Ø§ØªØ ÙØªØ­ÙÙÙØ§Øª CRM"
        action={
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            <UserPlus className="w-4 h-4" /> Ø¥Ø¶Ø§ÙØ© Ø¹ÙÙÙ
          </button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Ø¥Ø¬ÙØ§ÙÙ Ø§ÙØ¹ÙÙØ§Ø¡" value="0" sub="Ø§ÙÙØªØ¬Ø± Ø¬Ø¯ÙØ¯" icon={Users} color="blue" />
        <KPICard label="Ø¹ÙÙØ§Ö¡ VIP" value="0" sub="+0 ÙØ°Ø§ Ø§ÙØ´ÙØ±" icon={Sparkles} color="purple" />
        <KPICard label="ÙØªÙØ³Ø· Ø§ÙØ¥ÙÙØ§Ù" value="AED 0" sub="ÙÙÙ Ø¹ÙÙÙ" icon={DollarSign} color="green" />
        <KPICard label="ÙØ¹Ø¯Ù Ø§ÙØ§Ø­ØªÙØ§Ø¸" value="â" sub="ÙØ§ Ø¨ÙØ§ÙØ§Øª Ø¨Ø¹Ø¯" icon={RotateCcw} color="orange" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ¹ÙÙÙ</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ¨Ø±ÙØ¯</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ·ÙØ¨Ø§Øª</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙØ¥ÙÙØ§Ù Ø§ÙÙÙÙ</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Ø§ÙÙØ¦Ø©</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">ØªØ§Ø±ÙØ® Ø§ÙØªØ³Ø¬ÙÙ</th>
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
      <SectionHeader title="ÙØ±ÙØ² Ø§ÙØ°ÙØ§Ø¡ Ø§ÙØ§ØµØ·ÙØ§Ø¹Ù" subtitle="Ø¥Ø¯Ø§Ø±Ø© Ø§ÙÙÙÙØ§Ø¡ Ø§ÙØ°ÙÙÙÙ ÙØ§ÙÙØ¸Ø§Ù Ø§ÙØªØ´ØºÙÙÙ" />

      {/* Autonomous Mode */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600" /> ÙØ¶Ø¹ Ø§ÙØªØ´ØºÙÙ Ø§ÙØªÙÙØ§Ø¦Ù
            </h3>
            <p className="text-sm text-gray-500 mt-1">ØªØ­ÙÙ ÙÙ ÙØ³ØªÙÙ Ø§Ø³ØªÙÙØ§ÙÙØ© Ø§ÙØ°ÙØ§Ø¡ Ø§ÙØ§ØµØ·ÙØ§Ø¶Ù</p>
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
                {m === 'off' ? 'â Ø¥ÙÙØ§Ù' : m === 'assisted' ? 'ð¤ ÙØ³Ø§Ø¹Ø¯Ø©' : 'ð ØªÙÙØ§Ø¦Ù ÙØ§ÙÙ'}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 p-3 bg-white/70 rounded-lg">
          <p className="text-xs text-gray-600">
            {autonomousMode === 'off' && 'ð´ Ø§ÙØ°ÙØ§Ø¡ Ø§ÙØ§ØµØ·ÙØ§Ø¹Ù ÙÙ ÙØ¶Ø¹ Ø§ÙÙØ±Ø§ÙØ¨Ø© ÙÙØ· â ÙØ§ ÙØªÙØ°Ø¯ ÙØ±Ø§ËØ±Ø§Øª.'}
            {autonomousMode === 'assisted' && 'ð¡ Ø§ÙØ°ÙØ§Ø¡ Ø§ÙØ§ØµØ·ÙØ§Ø¹Ù ÙÙØªØ±Ø­Ø ÙØ§ÙÙØ§ÙÙ ÙÙØ§ÙÙ Ø¹ÙÙ ÙÙ Ø¥Ø¬Ø±Ø§Ø¡.'}
            {autonomousMode === 'full' && 'ð¢ Ø§ÙØ°ÙØ§Ø¡ Ø§ÙØ§ØµØ·ÙØ§Ø¹Ù ÙØªØ­ÙÙ Ø¨Ù 95% ÙÙ Ø§ÙØ¹ÙÙÙØ§Øª ØªÙÙØ§Ø¦ÙØ§Ù. Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø§ÙØ­Ø°Ù ØªØªØ·ÙØ¨ ÙÙØ§ÙÙØªÙ Ø¯Ø§Ø¦ÙØ§Ù.'}
          </p>
        </div>
      </div>

      {/* AI CEO Report */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500" /> ØªÙØ±ÙØ² Ø§ÙÙØ¯ÙØ± Ø§ÙØªÙÙÙØ°Ù ( I CEO)
          </h3>
          <button className="flex items-center gap-2 text-sm bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-medium hover:bg-amber-100">
            <RefreshCw className="w-3.5 h-3.5" /> Ø¥ÙØ´Ø§Ø¡ ØªÙØ¸Ø±ÙØ² Ø¬Ø¯ÙØ¯
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { title: 'ÙØ±Øµ Ø§ÙØ¥ÙØ±Ø§Ø¯Ø§Øª', text: 'ÙÙØªØ¬Ø§Øª Ø§ÙØ¥ÙÙØªØ±ÙÙÙØ§Øª ØªÙØ´ÙÙÙ 68% ÙÙ Ø§ÙØ·ÙØ¨Ø§Øª. ØªÙØ³ÙØ¹ Ø§ÙÙØªØ§ÙÙØ¬ ÙÙ ÙØ°Ø§ Ø§ÙÙØ·Ø§Ø¹ ÙÙØªÙØ­ Ø²ÙØ§Ø¯Ø© Ø¥ÙÙØ±Ø§Ø¯Ø§Øª Ø¨Ø³Ø¨Ø© 35%.' },
            { title: 'ØªØ­ÙÙÙ Ø§ÙÙØ®Ø§Ø·Ø±', text: '3 ÙÙØªØ¬Ø§Øª ÙÙØ¯Ø© ÙÙ Ø§ÙÙØ·. 18 Ø·ÙØ¨Ø§Ù ÙÙ ÙØ¶Ø¹ Ø§ÙÙØ·. ÙÙÙØµØ­ Ø¨Ø¥Ø¹Ø§Ø¯Ø© Ø§ÙØ·ÙØ¨ Ø®ÙØ§Ù 48 Ø³Ø§Ø¹Ø©.' },
            { title: 'ØªÙØµÙØ§Øª Ø§ÙØªØ³ÙÙÙ', text: 'Ø­ÙÙØ© Ø¹Ø±ÙØ¶ ÙÙØ§ÙÙ Ø§ÙÙÙ Ø§ÙØ£Ø³Ø¨ÙØ¹ ÙÙÙÙÙØ§ Ø§Ø³ØªÙØ¯Ø§Ù 48 Ø³ÙØ© ÙÙØ¬ÙØ±Ø© ÙØ­ØªÙÙØ© â ØªÙÙØ¹Ø§Øª ØªØ­ÙÙÙ 22%.' },
            { title: 'تحليل المورّدين', text: 'المورد الأول يسلّم في 3 أيام بمعدل رضا 94%. يُنصح بمراجعة شروط المورد الثاني.' },
          ].map((item, i) => (
            <div key={i} className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <p className="font-semibold text-amber-900 text-sm">{item.title}</p>
              <p className="text-amber-700 text-xs mt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Campaigns */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Ø§ÙÙØªÙØ§Öª Ø§ÙÙØª Ø§ÙÙØ±ÙØ§Öª Ø§ÙÙØ±ÙØ¨Ø§Ù¼/h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">+ Ø­ÙÙØ© Ø¬Ø¯ÙØ¯Ø©</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Summer Sale 2026', type: 'Ø®ØµÙ %30', reach: '12,340', status: 'active' },
              { name: 'Flash Deal Friday', type: 'ØµØ±Ø¶ ÙÙØªÙ', reach: '8,240', status: 'scheduled' },
              { name: 'Eid Specials', type: 'ÙØ¬ÙÙØ¹Ø©', reach: 'â', status: 'draft' },
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.type} â¢ ÙÙÙÙ: {c.reach}</p>
                </div>
                <Badge status={c.status === 'active' ? 'active' : 'pending'} />
              </div>
            ))}
          </div>
        </div>
        {/* Channels */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">ÙÙÙØ§Öª Ø§ÙÙØ±ÙÙÙ</h3>
          <div className="space-y-3">
            {[
              { name: 'Push Notifications', icon: Bell, sent: '2,420', rate: '18%' },
              { name: 'Instagram Ads', icon: Instagram, sent: '8,100', rate: '3.4%' },
              { name: 'Email Marketing', icon: Mail, sent: '1,200', rate: '22%' },
              { name: 'SMS Marketing', icon: MessageSquare, sent: '850', rate: '31%' },
            ].map(ch => (
              <div key={ch.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-lg border border-gray-200">
                    <ch.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{ch.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-800">{ch.sent} ÙØ±Ø·Ù
                  <p className="text-xs text-green-600 font-semibold">{ch.rate} ÙØªØ­
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MarketplaceSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Ø§ÙÙØªÙØ§Öª Ø§ÙÙØªÙØ©ÙØ©" subtitle="Ø¥Ø¯Ø§Ø±Ø© Ø§ÙÙØªÙØ§Öª Ø§ÙØ©ÙØ©" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Ø§ÙÙÙØ±Ø¯ÙÙ Ø§ÙÙØ´Ø·ÙÙ" value="4" sub="2 Ø¯Ø±ÙØ¨Ø´ÙØ¨Ù" icon={Store} color="blue" />
        <KPICard label="Ø²Ø¯ÙÙ¤Ù Ø§ÙÙÙØ±Ø¯ÙÙ Ø§ÙÙØ§Ø±Ø¯"" value="31" sub="3 Ø¨Ø§ÙØªØ®Ø§Ø± Ø§ÙØªØ£ÙÙØ¯" icon={Truck} color="orange" />
        <KPICard label="Ø§ÙÙØªÙØ§Öª Ø§ÙØ©ÙØ©"ÙØ³ØªÙØ¯Ø¹Ø©'" value="2" sub="Ø¯Ø¨Ù + Ø§ÙØ±ÙÙØ§" icon={Warehouse} color="green" />
        <KPICard label="ÙØªÙØ³Ø· ÙÙØª Ø§ÙØªØ³ÙÙÙ" value="2.8 ÙÙÙ" sub="ÙØ¯Ù: 2 ÙÙÙ" icon={Clock} color="purple" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">ÙØ§fm­  Ø§ÙÙÙØ±Ø¯ÙÙ Ø§ÙÙØ´Ø·ÙÙ ö`VØ§ÙÙØ¥ÙØ©'</h3>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            <Plus className="w-4 h-4" /> Ø¥Ø¶Ø§ÙØ© ÙÙØ±Ø¯
          </button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { name: 'ÙØ³ØªÙØ¯Ø¹ 4LEEE Ø§ÙÙØ±ÙØ²Ù', type: 'ÙØ³ØªÙØ¯Ø¹ Ø®Ø§Øµ', products: 45, rating: '4.9', location: 'Ø¯Ø¨Ù Ø§ÙÙØ§Ø±Ø§Øª' },
            { name: 'TechSupply Arabia', type: 'Ø¯Ø±ÙØ¨Ø´ÙØ¨Ù', products: 28, rating: '4.6', location: 'Ø§ÙÙØ§Ø±Ø§Øª Ø§ÙÙØ±Ø§Ø©' },
            { name: 'FashionLink UAE', type: 'Ø¯Ø±ÙØ¨Ø´ÙØ¨Ù', products: 12, rating: '4.2', location: 'Ø£Ø¨ÙØ¸Ø¨Ù Ø§ÙÙØ§Ø±Ø§Øª' },
            { name: 'Global Accessories Co.', type: 'Ø¬ÙÙØ©', products: 8, rating: '4.7', location: 'Ø´ÙÚ¹ÙØ§ÙØ Ø§ÙØµÙÙ' },
          ].map(s => (
            <div key={s.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.type} â¢ {s.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                   
ÆFcà¢Ç6Æ74æÖSÒ'FWB×2FWBÖw&ÓC#í}M]m­Í}j£Â÷à¢Ç6Æ74æÖSÒ'FWB×6ÒföçBÖ&öÆBFWBÖw&Ós#ç·2ç&öGV7G7ÓÂ÷à¢ÂöFcà¢ÆFcà¢Ç6Æ74æÖSÒ'FWB×2FWBÖw&ÓC#í}M­-­­SÂ÷à¢Ç6Æ74æÖSÒ'FWB×6ÒföçBÖ&öÆBFWB×VÆÆ÷rÓS#î*Ù·2ç&FæwÓÂ÷à¢ÂöFcà¢Æ'WGFöâ6Æ74æÖSÒ'FWBÖw&ÓC÷fW#§FWBÖ&ÇVRÓc#ãÄÖ÷&T÷&¦öçFÂ6Æ74æÖSÒ'rÓBÓB"óãÂö'WGFöãà¢ÂöFcà¢ÂöFcà¢Ð¢ÂöFcà¢ÂöFcà¢ÂöFcà¢§Ð ¦gVæ7FöâV×Æ÷VW56V7Föâ°¢6öç7B¶V×Æ÷VW2Â6WDV×Æ÷VW5ÒÒW6U7FFRÔô4µôTÕÄõTU2¢6öç7B·6÷tf÷&ÒÂ6WE6÷tf÷&ÕÒÒW6U7FFRfÇ6R¢&WGW&â¢ÆFb6Æ74æÖSÒ'76R×Ób#à¢Å6V7FöäVFW ¢FFÆSÒ-}M]b
}]}í]M}}¢ ¢7V'FFÆSÒ-]ý}
}­"
}M]B
­Ýý­ò
]=­­}¢
}M]B ¢7Föã×°¢Æ'WGFöâöä6Æ6³×²Óâ6WE6÷tf÷&Ò6÷tf÷&ÒÐ¢6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"&rÖ&ÇVRÓcFWB×vFRÓBÓ"&÷VæFVBÖÆrFWB×6ÒföçB×6VÖ&öÆB÷fW#¦&rÖ&ÇVRÓs#à¢ÅW6W%ÇW26Æ74æÖSÒ'rÓBÓB"óâ
]
Íý­ð¢Âö'WGFöãà¢Ð¢óà ¢ÆFb6Æ74æÖSÒ&w&Bw&BÖ6öÇ2Ó2vÓB#à¢Äµ6&BÆ&VÃÒ-]Í]}]¢
}M]­b"fÇVS×¶V×Æ÷VW2æÆVæwFçFõ7G&ærÒ6öã×µW6W'7Ò6öÆ÷#Ò&&ÇVR"óà¢Äµ6&BÆ&VÃÒ-}]}}¢
}]]}­­m]r"fÇVSÒ#R"6öã×´ÆW'7Ò6öÆ÷#Ò'W'ÆR"óà¢Äµ6&BÆ&VÃÒ-mM}b
}]}­="
}]""fÇVS×¶V×Æ÷VW2æfÇFW"RÓâRç7FGW2ÓÓÒv7FfRræÆVæwFçFõ7G&ærÒ6öã×´7FfGÒ6öÆ÷#Ò&w&VVâ"óà¢ÂöFcà ¢·6÷tf÷&Òbb¢ÆFb6Æ74æÖSÒ&&r×vFR&÷VæFVB×Â&÷&FW"&÷&FW"Ö&ÇVRÓ#ÓR#à¢Æ26Æ74æÖSÒ&föçBÖ&öÆBFWBÖw&ÓÖ"ÓB#í]m}
]
Íý­óÂö3à¢ÆFb6Æ74æÖSÒ&w&Bw&BÖ6öÇ2Ó"vÓB#à¢µ²}}M}=R
}]}]brÂ}}M­ò
}M]]}­]brÂ}}M=R
}]}]buÒæÖbÓâ¢ÆFb¶W×¶gÓà¢ÆÆ&VÂ6Æ74æÖSÒ'FWB×2föçB×6VÖ&öÆBFWBÖw&Óc&Æö6²Ö"Ó#ç¶gÓÂöÆ&VÃà¢ÆçWB6Æ74æÖSÒ'rÖgVÆÂ&÷&FW"&÷&FW"Öw&Ó#&÷VæFVBÖÆrÓ2Ó"FWB×6Òfö7W3¦÷WFÆæRÖæöæRfö7W3§&ærÓ"fö7W3§&ærÖ&ÇVRÓS"óà¢ÂöFcà¢Ð¢ÆFcà¢ÆÆ&VÂ6Æ74æÖSÒ'FWB×2föçB×6VÖ&öÆBFWBÖw&Óc&Æö6²Ö"Ó#í}]"
}M]ÄTTRsÂöÆ&VÃà¢Ç6VÆV7B6Æ74æÖSÒ'rÖgVÆÂ&÷&FW"&÷&FW"Öw&Ó#&÷VæFVBÖÆrÓ2Ó"FWB×6Òfö7W3¦÷WFÆæRÖæöæR#à¢µ²tFÖârÂtÖævW"rÂu7W÷'BrÂu&öGV7BÖævW"rÂtfææ6RÖævW"uÒæÖ"ÓâÆ÷Föâ¶W×·'Óç·'ÓÂö÷FöãâÐ¢Â÷6VÆV7Cà¢ÂöFcà¢ÆFcà¢ÆÆ&VÂ6Æ74æÖSÒ'FWB×2föçB×6VÖ&öÆBFWBÖw&Óc&Æö6²Ö"Ó#í}]}]b
}M-sÂöÆ&VÃà¢Ç6VÆV7B6Æ74æÖSÒ'rÖgVÆÂ&÷&FW"&÷&FW"Öw&Ó#&÷VæFVBÖÆrÓ2Ó"FWB×6Òfö7W3¦÷WFÆæRÖæöæR#à¢µ²}­-]­"
}M]M]}¢rÂ}}M]M}rÂ}íý]
}M]M}rÂ}}M­=­"rÂ}}M]}M­uÒæÖBÓâÆ÷Föâ¶W×¶GÓç¶GÓÂö÷FöãâÐ¢Â÷6VÆV7Cà¢ÂöFcà¢ÂöFcà¢ÆFb6Æ74æÖSÒ&fÆWvÓ2×BÓB#à¢Æ'WGFöâöä6Æ6³×²Óâ6WE6÷tf÷&ÒfÇ6RÒ6Æ74æÖSÒ&&rÖ&ÇVRÓcFWB×vFRÓRÓ"&÷VæFVBÖÆrFWB×6ÒföçB×6VÖ&öÆB#íÝÂö'WGFöãà¢Æ'WGFöâöä6Æ6³×²Óâ6WE6÷tf÷&ÒfÇ6RÒ6Æ74æÖSÒ&&rÖw&ÓFWBÖw&ÓsÓRÓ"&÷VæFVBÖÆrFWB×6Ò#í]M­}Âö'WGFöãà¢ÂöFcà¢ÂöFcà¢Ð ¢ÆFb6Æ74æÖSÒ&&r×vFR&÷VæFVB×Â&÷&FW"&÷&FW"Öw&Ó#6F÷r×6Ò÷fW&fÆ÷rÖFFVâ#à¢ÇF&ÆR6Æ74æÖSÒ'rÖgVÆÂ#à¢ÇFVCà¢ÇG"6Æ74æÖSÒ&&÷&FW"Ö"&÷&FW"Öw&Ó&rÖw&ÓS#à¢µ²}}M]rÂ}}M­òrÂ}}]}]brÂ}r
}]}]brÂ}}MÝ}MrÂ}]Í}}¢uÒæÖÓâ¢ÇF¶W×¶Ò6Æ74æÖSÒ'FWB×&vBFWB×2föçB×6VÖ&öÆBFWBÖw&ÓSÓBÓ2#ç¶ÓÂ÷Fà¢Ð¢Â÷G#à¢Â÷FVCà¢ÇF&öGà¢¶V×Æ÷VW2æÖRÓâ¢ÇG"¶W×¶RæGÒ6Æ74æÖSÒ&&÷&FW"Ö"&÷&FW"Öw&ÓS÷fW#¦&rÖw&ÓS#à¢ÇFB6Æ74æÖSÒ'ÓBÓ2#à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ2#à¢ÆFb6Æ74æÖSÒ'rÓÓ&÷VæFVBÖgVÆÂ&rÖw&FVçB×FòÖ'"g&öÒ×föÆWBÓCFòÖ&ÇVRÓSfÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"FWB×vFRFWB×2föçBÖ&öÆB#à¢¶RææÖU³×Ð¢ÂöFcà¢Ç7â6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖw&Ó#ç¶RææÖWÓÂ÷7ãà¢ÂöFcà¢Â÷FCà¢ÇFB6Æ74æÖSÒ'ÓBÓ2FWB×6ÒFWBÖw&ÓS#ç¶RæVÖÇÓÂ÷FCà¢ÇFB6Æ74æÖSÒ'ÓBÓ2#ãÄ&FvR7FGW3×¶Rç&öÆRÓÓÒtFÖâròudr¢u&VwVÆ"wÒóãÂ÷FCà¢ÇFB6Æ74æÖSÒ'ÓBÓ2FWB×6ÒFWBÖw&Óc#ç¶RæFWGÓÂ÷FCà¢ÇFB6Æ74æÖSÒ'ÓBÓ2#ãÄ&FvR7FGW3Ò&7FfR"óãÂ÷FCà¢ÇFB6Æ74æÖSÒ'ÓBÓ2#à¢ÆFb6Æ74æÖSÒ&fÆWvÓ"#à¢Æ'WGFöâ6Æ74æÖSÒ'FWBÖw&ÓC÷fW#§FWBÖ&ÇVRÓc#ãÄVFC"6Æ74æÖSÒ'rÓBÓB"óãÂö'WGFöãà¢Æ'WGFöâöä6Æ6³×²Óâ6WDV×Æ÷VW2&WbÓâ&WbæfÇFW"V×ÓâV×æBÓÒRæBÐ¢6Æ74æÖSÒ'FWBÖw&ÓC÷fW#§FWB×&VBÓS#ãÅG&6"6Æ74æÖSÒ'rÓBÓB"óãÂö'WGFöãà¢ÂöFcà¢Â÷FCà¢Â÷G#à¢Ð¢Â÷F&öGà¢Â÷F&ÆSà¢ÂöFcà¢ÂöFcà¢§Ð ¦gVæ7Föâfææ6U6V7Föâ°¢&WGW&â¢ÆFb6Æ74æÖSÒ'76R×Ób#à¢Å6V7FöäVFW"FFÆSÒ-}M]}M­
}M]­ý}¢"7V'FFÆSÒ-­­}¢
}]}½}²
}M]­}ý}­Â
}M]]}­Â
}M=}Ò
}M]}­"óà¢ÆFb6Æ74æÖSÒ&w&Bw&BÖ6öÇ2Ó"Æs¦w&BÖ6öÇ2ÓBvÓB#à¢Äµ6&BÆ&VÃÒ-}M]­}ý}¢
}M=]­Ír"fÇVSÒ$TBÃC#"G&VæC×³Ò6öã×µG&VæFæuWÒ6öÆ÷#Ò&w&VVâ"óà¢Äµ6&BÆ&VÃÒ-}M]]}­"fÇVSÒ$TBcÃ#"G&VæC×³7Ò6öã×µ&V6VGÒ6öÆ÷#Ò'&VB"óà¢Äµ6&BÆ&VÃÒ-]}¢
}MÒ"fÇVSÒ$TB#ÃC"G&VæC×³GÒ6öã×´FöÆÆ%6vçÒ6öÆ÷#Ò&&ÇVR"óà¢Äµ6&BÆ&VÃÒ-}M]ý}j¢
}]}]b¢"fÇVSÒ$TBBÃ#"6öã×´6Æö6·Ò6öÆ÷#Ò&÷&ævR"óà¢ÂöFcà¢ÆFb6Æ74æÖSÒ&&r×vFR&÷VæFVB×Â&÷&FW"&÷&FW"Öw&Ó#ÓR6F÷r×6Ò#à¢Æ26Æ74æÖSÒ&föçBÖ&öÆBFWBÖw&ÓÖ"ÓB#í}M}}¢
}M]bfffbbð½ Ìø(ñ¥Ø±ÍÍ9µôÍÁµä´Ìø(íl(ìÍèbßfb ÐÔÈÄ´bb·fb¼bfbËfbÇX¥f+b¤°µ½Õ¹Ðè­Ìàä°ÑåÁè¥¹½µ°ÑèÈÀÈØ´ÀØ´ÄÔô°(ìÍèfbb«f#bÇX¤ff#bÇb¼Q¡MÕÁÁ±ä°µ½Õ¹ÐèµÄ°ÈÐÀ°ÑåÁèáÁ¹Í°ÑèÈÀÈØ´ÀØ´ÄÐô°(ìÍèbßfb ÐÔÈÀ´fbbßff bfbçfbÇf(°µ½Õ¹Ðè­ÄÈä°ÑåÁè¥¹½µ°ÑèÈÀÈØ´ÀØ´ÄÐô°(ìÍèbÇbÏf#fM¡½Á¥ä¹bfbËfbÇf+b¤°µ½Õ¹ÐèµÈàä°ÑåÁèáÁ¹Í°ÑèÈÀÈØ´ÀØ´ÄÌô°(ìÍèbßffb ÐÔÄä´fb·fb¼bfbçbÏf+fcf(°µ½Õ¹Ðè­ÜÐä°ÑåÁè¥¹½µ°ÑèÈÀÈØ´ÀØ´ÄÌô°(t¹µÀ ¡Ð°¤¤ôø (ñ¥Ø­äõí¥ô±ÍÍ9µô±à¥ÑµÌµ¹ÑÈ©ÕÍÑ¥äµÑÝ¸À´ÌµÉä´ÔÀÉ½Õ¹µ±ø(ñ¥Ø±ÍÍ9µô±à¥ÑµÌµ¹ÑÈÀ´Ìø(ñ¥Ø±ÍÍ9µõíÀ´ÈÉ½Õ¹µ±íÐ¹ÑåÁôôô¥¹½µüµÉ¸´ÔÀèµÉ´ÔÀõôø(íÐ¹ÑåÁôôô¥¹½µüñÉÉ½ÝUÁI¥¡Ð±ÍÍ9µôÜ´Ð ´ÐÑáÐµÉ¸´ØÀÀ¼øèñQÉ¹¥¹½Ý¸±ÍÍ9µôÜ´Ð ´ÐÑáÐµÉ´ÔÀÀ¼ùô(ð½¥Øø(ñ¥Øø(ñÀ±ÍÍ9µôÑáÐµÍ´½¹Ðµµ¥Õ´ÑáÐµÉä´àÀÀùíÐ¹Íôð½Àø(ñÀ±ÍÍ9µôÑáÐµáÌÑáÐµÉä´ÐÀÀùíÐ¹Ñôð½Àø(ð½¥Øø(ð½¥Øø(ñÍÁ¸±ÍÍ9µõíÑáÐµÍ´½¹Ðµ½±íÐ¹ÑåÁôôô¥¹½µüÑáÐµÉ¸´ØÀÀèÑáÐµÉ´ÔÀÀõôùíÐ¹µ½Õ¹Ñôð½ÍÁ¸ø(ð½¥Øø(¤¥ô(ð½¥Øø(ð½¥Øø(ð½¥Øø(¤)ô()Õ¹Ñ¥½¸A±Ñ½ÉµMÑ¥½¸ ¤ì(½¹ÍÐÍÉÙ¥Ìôl(ì¹µèbfff#fbäbfbffb«bÇf#ff(°ÕÉ°èØÀµ±éµÁÀµÕ¤¹ÙÉ°¹ÁÀ°ÍÑÑÕÌèÑÉÕ°ÕÁÑ¥µèää¸äàô°(ì¹µèb«bßb£f+f°ÕÉ°èÁ±ä¹½½±¹½´¼Ñ±°ÍÑÑÕÌèÑÉÕ°ÕÁÑ¥µèää¸äÔô°(ì¹µèb«bßb£f+f¥A¡½¹°ÕÉ°èÁÁÌ¹ÁÁ±¹½´¼Ñ±°ÍÑÑÕÌèÑÉÕ°ÕÁÑ¥µèää¸äÜô°(ì¹µèA$ÑÝä°ÕÉ°èÁ¤¸Ñ±¹½´°ÍÑÑÕÌèÑÉÕ°ÕÁÑ¥µèää¸ääô°(ì¹µè
89ÑÝ½É¬°ÕÉ°è¸¸Ñ±¹½´°ÍÑÑÕÌèÑÉÕ°ÕÁÑ¥µèÄÀÀô°(ì¹µèAÕÍ MÉÙ¥°ÕÉ°èÁÕÍ ¸Ñ±¹½´°ÍÑÑÕÌè±Í°ÕÁÑ¥µèäà¸Äô°(t(ÉÑÕÉ¸ (ñ¥Ø±ÍÍ9µôÍÁµä´Øø(ñMÑ¥½¹!ÈÑ¥Ñ±ôffb×b«f(bffbÇff+b¤ÍÕÑ¥Ñ±ôfbÇbfb§bb³ff+bäfff#bb¤A±Ñ½É´bfb«f#b×f+ff#bfbfbOff+b¤¼ø(ñ¥Ø±ÍÍ9µôÉ¥É¥µ½±Ì´Ä±éÉ¥µ½±Ì´ÈÀ´Ðø(íÍÉÙ¥Ì¹µÀ¡Ìôø (ñ¥Ø­äõíÌ¹¹µô±ÍÍ9µôµÝ¡¥ÑÉ½Õ¹µá°½ÉÈ½ÉÈµÉä´ÈÀÀÀ´ÐÍ¡½ÜµÍ´±à¥ÑµÌµ¹ÑÈ©ÕÍÑ¥äµÑÝ¸ø(ñ¥Ø±ÍÍ9µô±à¥ÑµÌµ¹ÑÈÀ´Ìø(ñ¥Ø±ÍÍ9µõíÀ´ÈÉ½Õ¹µ±íÌ¹ÍÑÑÕÌüµÉ¸´ÔÀèµÉ´ÔÀõôø(ñMÉÙÈ±ÍÍ9µõíÜ´Ð ´ÐíÌ¹ÍÑÑÕÌüÑáÐµÉ¸´ØÀÀèÑáÐµÉ´ÔÀÀõô¼ø(ð½¥Øø(ñ¥Øø(ñÀ±ÍÍ9µôÑáÐµÍ´½¹Ðµ½±ÑáÐµÉä´àÀÀùíÌ¹¹µôð½Àø(ñÀ±ÍÍ9µôÑáÐµáÌÑáÐµÉä´ÐÀÀùíÌ¹ÕÉ±ôð½Àø(ð½¥Øø(ð½¥Øø(ñ¥Ø±ÍÍ9µôÑáÐµÉ¥¡Ðø(ñ¥Ø±ÍÍ9µõí±à¥ÑµÌµ¹ÑÈÀ´Ä¸Ô©ÕÍÑ¥äµ¹µ´Åôø(ñ¥Ø±ÍÍ9µõíÜ´È ´ÈÉ½Õ¹µÕ±°íÌ¹ÍÑÑÕÌüµÉ¸´ÔÀÀ¹¥µÑµÁÕ±ÍèµÉ´ÔÀÀõô¼ø(ñÍÁ¸±ÍÍ9µõíÑáÐµáÌ½¹Ðµ½±íÌ¹ÍÑÑÕÌüÑáÐµÉ¸´ØÀÀèÑáÐµÉ´ÔÀÀõôø(íÌ¹ÍÑÑÕÌüf+fcbçffèfb«f#ffô(ð½ÍÁ¸ø(ð½¥Øø(ñÀ±ÍÍ9µôÑáÐµáÌÑáÐµÉä´ÐÀÀùÕÁÑ¥µèíÌ¹ÕÁÑ¥µôð½Àø(ð½¥Øø(ð½¥Øø(¤¥ô(ð½¥Øø(ð½¥Øø(¤)ô()Õ¹Ñ¥½¸M¡½Á¥åMÑ¥½¸ ¤ì(½¹ÍÐm½µ¥¸°ÍÑ½µ¥¹tôÕÍMÑÑ Íµ¥Ü´Ää¹µåÍ¡½Á¥ä¹½´¤(½¹ÍÐmÑ½­¸°ÍÑQ½­¹tôÕÍMÑÑ ¤(½¹ÍÐmÍå¹¥¹°ÍÑMå¹¥¹tôÕÍMÑÑ¡±Í¤(½¹ÍÐmÍÑÑÕÌ°ÍÑMÑÑÕÍtôÕÍMÑÑð½¹¹Ñð¥Í½¹¹Ñø ½¹¹Ñ¤((½¹ÍÐ¡¹±Må¹ôÍå¹ ¤ôøì(ÍÑMå¹¥¹¡ÑÉÕ¤(Ý¥Ð¹ÜAÉ½µ¥Í¡ÈôøÍÑQ¥µ½ÕÐ¡È°ÄÔÀÀ¤¤(ÍÑMÑÑÕÌ ½¹¹Ñ¤(ÍÑMå¹¥¹¡±Í¤(ô((ÉÑÕÉ¸ (ñ¥Ø±ÍÍ9µôÍÁµä´Øø(ñMÑ¥½¹!ÈÑ¥Ñ±ôM¡½Á¥ä	­¹ÍÕÑ¥Ñ±ôfbÇbfff(bfff/fb«b0bffbÇfb0f#bfff/fbÇb¤bffbfbÇb¤fbçfM¡½Á¥ä¼ø(ñ¥Ø±ÍÍ9µôÉ¥É¥µ½±Ì´È±éÉ¥µ½±Ì´ÐÀ´Ðø(ñ-A%
É±°ôbfff/fb¨bffff/ff+ff(Ù±ÕôÔÀÍÕôbb»bÈfff+f#fèbfff+f¥½¸õíA­ô½±½ÈôÉ¸¼ø(ñ-A%
É±°ôbfbßffb£bb¨bffff/ff+ff(Ù±ÕôÀÍÕôbffb«b¯bàb³b¿f+f<¥½¸õíM¡½ÁÁ¥¹
ÉÑô½±½Èô±Õ¼ø(ñ-A%
É±°ôbfbçffbbbffff/ff+ff'f+b¤Ù±ÕôÀÍÕôfbbçffbbb£bçb¿b¼¥½¸õíUÍÉÍô½±½ÈôÁÕÉÁ±¼ø(ñ-A%
É±°ôb·bff+fbffbËffb¨bfb§b×bfÙ±ÕõíÍÑÑÕÌôôô½¹¹Ñürfb«b×fèv0fffbßfô¥½¸õí1¥¹­ô½±½ÈõíÍÑÑÕÌôôô½¹¹ÑüÉ¸èÉô¼ø(ð½¥Øø(ñ¥Ø±ÍÍ9µôµÝ¡¥ÑÉ½Õ¹µá°½ÉÈ½ÉÈµÉä´ÈÀÀÀ´ÔÍ¡½ÜµÍ´ø(ñ Ì±ÍÍ9µô½¹Ðµ½±ÑáÐµÉä´äÀÀµ´Ðûbbçb¿bb¿bb¨bfbfbÇff+fb¤b£fM¡½Á¥äð½ Ìø(ñ¥Ø±ÍÍ9µôÍÁµä´Ðø(ñ¥Øø(ñ±°±ÍÍ9µôÑáÐµáÌ½¹ÐµÍµ¥½±ÑáÐµÉä´ØÀÀ±½¬µ´Äûbfff/ffbffb«b¬ð½±°ø(ñ¥¹ÁÕÐÙ±Õõí½µ¥¹ô½¹
¡¹õíôøÍÑ½µ¥¸¡¹ÑÉÐ¹Ù±Õ¥ô(±ÍÍ9µôÜµÕ±°½ÉÈ½ÉÈµÉä´ÈÀÀÉ½Õ¹µ±Áà´ÌÁä´È¸ÔÑáÐµÍ´½ÕÌé½ÕÑ±¥¹µ¹½¹½ÕÌéÉ¥¹´È½ÕÌéÉ¥¹µ±Õ´ÔÀÀ¼ø(ð½¥Øø(ñ¥Øø(ñ±°±ÍÍ9µôÑáÐµáÌ½¹ÐµÍµ¥½±ÑáÐµÉä´ØÀÀ±½¬µ´ÄùÍÌQ½­¸ð½±°ø(ñ¥¹ÁÕÐÑåÁôÁÍÍÝ½ÉÙ±ÕõíÑ½­¹ô½¹
¡¹õíôøÍÑQ½­¸¡¹ÑÉÐ¹Ù±Õ¥ô(Á±¡½±ÈôÍ¡ÁÑ}áááááááááááááááááááááááà(±ÍÍ9µôÜµÕ±°½ÉÈ½ÉÈµÉä´ÈÀÀÉ½Õ¹µ±Áà´ÌÁä´È¸ÔÑáÐµÍ´½ÕÌé½ÕÑ±¥¹µ¹½¹½ÕÌéÉ¥¹´È½ÕÌéÉ¥¹µ±Õ´ÔÀÀ¼ø(ð½¥Øø(ñÕÑÑ½¸½¹
±¥¬õí¡¹±Må¹ô¥Í±õíÍå¹¥¹ô(±ÍÍ9µô±à¥ÑµÌµ¹ÑÈÀ´ÈµÉ¸´ØÀÀÑáÐµÝ¡¥ÑÁà´ÔÁä´È¸ÔÉ½Õ¹µ±ÑáÐµÍ´½¹ÐµÍµ¥½±¡½ÙÈéµÉ¸´ÜÀÀÑÉ¹Í¥Ñ¥½¸µ½±½ÉÌø(ñIÉÍ¡
Ü±ÍÍ9µõíÜ´Ð ´ÐíÍå¹¥¹ü¹¥µÑµÍÁ¥¸èõô¼ø(íÍå¹¥¹üb³bbÇfbfff/ff/ff+f¸¸¸èb«bgbßf+fbfff+ff'f(bffbffff+b¤ô(ð½ÕÑÑ½¸ø(ð½¥Øø(ð½¥Øø(ñ¥Ø±ÍÍ9µôµÝ¡¥ÑÉ½Õ¹µá°½ÉÈ½ÉÈµÉä´ÈÀÀÀ´ÔÍ¡½ÜµÍ´ø(ñ Ì±ÍÍ9µô½¹Ðµ½±ÑáÐµÉä´äÀÀµ´ÐûbbÓfbÇbb¨bffff/ff+ff+ff#bfff+fð½ Ìø(ñ¥Ø±ÍÍ9µôÍÁµä´Èø(íl(ìÙ¹Ðèfff+ff'f(bffff/ff+ff+f°½Õ¹ÐèÔÀfff/ff(°Ñ¥µèbff+f#fÄÐèÌÈ°½¬èÑÉÕô°(ìÙ¹Ðèfff+ff+fbfbßffb£bZ¨°½Õ¹ÐèÀbßffb£bb¨°Ñ¥µèbff+f#fÄÐèÌÈ°½¬èÑÉÕô°(ìÙ¹Ðèfff+ff+fbfbçffbb°½Õ¹ÐèÀbçfffbb°Ñ¥µèbff+f#fÄÐèÌÄ°½¬èÑÉÕô°(ìÙ¹ÐèfbÓf´)¥Ébb«b×bf°½Õ¹ÐèP°Ñ¥µèbfbÌÀàèÄÔ°½¬è±Íô°(t¹µÀ ¡°°¤¤ôø (ñ¥Ø­äõí¥ô±ÍÍ9µô±à¥ÑµÌµ¹ÑÈ©ÕÍÑ¥äµÑÝ¸À´ÌµÉä´ÔÀÉ½Õ¹µ±ÑáÐµÍ´ø(ñ¥Ø±ÍÍ9µô±à¥ÑµÌµ¹ÑÈÀ´Èø(í°¹½¬üñ
¡­
¥É±È±ÍÍ9µôÜ´Ð ´ÐÑáÐµÉ¸´ÔÀÀ¼øèña
¥É±±ÍÍ9µôÜ´Ð ´ÐÑáÐµÉ´ÐÀÀ¼ùô(ñÍÁ¸±ÍÍ9µôÑáÐµÉä´ÜÀÀùí°¹Ù¹Ñôð½ÍÁ¸ø(ñÍÁ¸±ÍÍ9µôÑáÐµÉä´ÐÀÀÑáÐµáÌùí°¹½Õ¹Ñôð½ÍÁ¸ø(ð½¥Øø(ñÍÁ¸±ÍÍ9µôÑáÐµáÌÑáÐµÉä´ÐÀÀùí°¹Ñ¥µôð½ÍÁ¸ø(ð½¥Øø(¤¥ô(ð½¥Øø(ð½¥Øø(ð½¥Øø(¤)ô()Õ¹Ñ¥½¸MÕÉ¥ÑåMÑ¥½¸ ¤ì(ÉÑÕÉ¸ (ñ¥Ø±ÍÍ9µôÍÁµä´Øø(ñMÑ¥½¹!ÈÑ¥Ñ±ôbfbfbff#bffbÇbfb§bÍÕÑ¥Ñ±ôbÏb³fbffbÜbffb¿bff(bffbÇbfb£b¢f(f#bfffb«b¢f+f4¼ø(ñ¥Ø±ÍÍ9µôÉ¥É¥µ½±Ì´È±éÉ¥µ½±Ì´ÐÀ´Ðø(ñ-A%
É±°ôbfb³fbÏbb¨bffbÇb¤bffb«bÙ±ÕôÌÍÕôb³bff'bËbfb³b¿f+b¿bf¥½¸õí5½¹¥Ñ½Éô½±½Èô±Õ¼ø(ñ-A%
É±°ôfb·bf#fbb¨b¿b»f#ffbÓb£f#ff,Ù±ÕôÀÍÕôbb»bÈÈÐbÏbbçb¤¥½¸õí±ÉÑ
¥É±ô½±½ÈôÉ¸¼ø(ñ-A%
É±°ôffbb«f+b´A$Ù±ÕôÐÍÕôÈffb«f#b¤¥½¸õí-åô½±½ÈôÁÕÉÁ±¼ø(ñ-A%
É±°ôfb¿f#bÄb§f(ÉÙ±Õôffbçff¥½¸õíM¡¥±ô½±½ÈôÉ¸¼ø(ð½¥Øø(ñ¥Ø±ÍÍ9µôµÝ¡¥ÑÉ½Õ¹µá°½ÉÈ½ÉÈµÉä´ÈÀÀÀ´ÔÍ¡½ÜµÍ´ø(ñ Ì±ÍÍ9µô½¹Ðµ½±ÑáÐµÉä´äÀÀµ´ÐûbÏb³fbfbffbbfff/ff+ff(hð½ Ìø(ñ¥Ø±ÜÜÓ[YOHÜXÙK^KLÈÖÂÈXÝ[Û	ö*¶,ö+6b¶a6+ö+¶b6a6a¶)ö+6+IË\Ù\	Û[ÚÙ[LLÉË\	ÌNLMKIË[YN	ö)öavb¶b6aHM	ËÚÎYHKÈXÝ[Û	ö*¶+v+öb¶*ÈÈ6ava¶*¶+6)ö*Ë\Ù\	Û[ÚÙ[LLÉË\	ÌNLMKIË[YN	ö)öa6b¶b6aHLÎ
IËÚÎYHKÈXÝ[Û	öav,¶)öava¶jHÚÜYIË\Ù\	ö)öa6a¶.6)öaIË\	ø %	Ë[YN	ö)öa6b¶b6aHMÌËÚÎYHKÈXÝ[Û	öav+v)öb6a6*H6+ö+¶b6a6`v)ö-6a6*IË\Ù\	Ý[ÛÝÛË\	Í
KÌËÌMMË[YN	ö(öav,ÈM	ËÚÎ[ÙHKKX\

JHO
]Ù^O^Ú_HÛ\ÜÓ[YOH^][\ËXÙ[\\ÝYKX]ÙY[LÈËYÜ^KMLÝ[Y[È]Û\ÜÓ[YOH^][\ËXÙ[\Ø\LÈÛÚÈÈÚXÚÐÚ\ÛLÛ\ÜÓ[YOHËMM^YÜY[MLÏ[\Ú\ÛHÛ\ÜÓ[YOHËMM^\YMÏB]Û\ÜÓ[YOH^\ÛHÛ[YY][H^YÜ^KNÛXÝ[ÛOÜÛ\ÜÓ[YOH^^È^YÜ^KMÛ\Ù\H8 (Û\OÜÙ]Ù]Ü[Û\ÜÓ[YOH^^È^YÜ^KMÛ[Y_OÜÜ[Ù]
J_BÙ]Ù]Ù]
BB[Ý[ÛÙ][ÜÔÙXÝ[ÛÈÛÞ[ÔÚÜYHNÈÛÞ[ÔÚÜYOÎ[Ý[ÛJHÂÛÛÝØ\[YKÙ]\[YWHH\ÙTÝ]J	ÍQQIÊBÛÛÝÛ[ÝXYÙKÙ][ÝXYÙWHH\ÙTÝ]J	Ø\ÊBÛÛÝØÝ\[ÞKÙ]Ý\[ÞWHH\ÙTÝ]J	ÐQQ	ÊBÛÛÝÛXZ[[[ÙKÙ]XZ[[[ÙWHH\ÙTÝ]J[ÙJB]\
]Û\ÜÓ[YOHÜXÙK^KMÙXÝ[ÛXY\]OH¶)öa6)v.v+ö)ö+ö)ö*6)öa6.v)öavjHÝX]OH¶*¶+¶-vb¶-H6)öa6ava¶-vbv#6)öa6a6.¶jJ¶#6)öavaöböaöa6jH6b6)öa6*¶`ö)öava6)õªÏ]Û\ÜÓ[YOHÜYÜYXÛÛËLHÎÜYXÛÛËLØ\MH]Û\ÜÓ[YOHË]Ú]HÝ[Y^Ü\Ü\YÜ^KLMHÚYÝË\ÛHÜXÙK^KMÈÛ\ÜÓ[YOHÛXÛ^YÜ^KNL¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§ÙÙÙØµØ©Y</h3>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Ø§Ø³öaH6)öavaöböaöa¶b¶aöbÏÛX[[][YO^Ø\[Y_HÛÚ[ÙO^ÙHOÙ]\[YJK\Ù][YJ_BÛ\ÜÓ[YOHËY[Ü\Ü\YÜ^KLÝ[Y[ÈLÈKL^\ÛHØÝ\ÎÝ][K[ÛHØÝ\Î[ËLØÝ\Î[ËXYKMLÏÙ]]X[Û\ÜÓ[YOH^^ÈÛ\Ù[ZXÛ^YÜ^KMØÚÈXLH¶)öa6a6.¶*H6)öa6)ö`v*¶,v)ö-¶b¶*OÛX[Ù[XÝ[YO^Û[ÝXYÙ_HÛÚ[ÙO^ÙHOÙ][ÝXYÙJK\Ù][YJ_BÛ\ÜÓ[YOHËY[Ü\Ü\YÜ^KLÝ[Y[ÈLÈKL^\ÛHØÝ\ÎÝ][K[ÛHÜ[Û[YOH\¶)öa6.v,v*6b¶b¶*VbÛÜ[ÛÜ[Û[YOH[[Û\ÚÛÜ[ÛÜÙ[XÝÙ]]X[Û\ÜÓ[YOH^^ÈÛ\Ù[ZXÛ^YÜ^KMØÚÈXLH¶)öa6.vava6*VbÛX[Ù[XÝ[YO^ØÝ\[Þ_HÛÚ[ÙO^ÙHOÙ]Ý\[ÞJK\Ù][YJ_BÛ\ÜÓ[YOHËY[Ü\Ü\YÜ^KLÝ[Y[ÈLÈKL^\ÛHØÝ\ÎÝ][K[ÛHÖÉÐQQ	Ë	ÕTÑ	Ë	ÔÐTË	ÑUT×KX\
ÈOÜ[ÛÙ^O^ØßOØßOÛÜ[Û_BÜÙ[XÝÙ]]Û\ÜÓ[YOH^][\ËXÙ[\\ÝYKX]ÙY[LÈËYÜ^KMLÝ[Y[È]Û\ÜÓ[YOH^\ÛHÛ\Ù[ZXÛ^YÜ^KN¶b6-¶.H6)öa6-vb©öa¶b¶av*FbÜÛ\ÜÓ[YOH^^È^YÜ^KM¶)vb¶`¶)ö`H6)öa6av*¶+6,H6av)6`¶*¶)öbÈ6a6a6,¶b6)ö,OÜÙ]]ÛÛÛXÚÏ^Ê
HOÙ]XZ[[[ÙJ[XZ[[[ÙJ_HÛ\ÜÓ[YOH^YÜ^KMÛXZ[[[ÙHÈÙÙÛTYÚÛ\ÜÓ[YOHËNN^XYKMLÏÙÙÛSYÛ\ÜÓ[YOHËNNÏBØ]ÛÙ]]ÛÛ\ÜÓ[YOHËY[ËXYKM^]Ú]HKLHÝ[Y[È^\ÛHÛ\Ù[ZXÛÝ\ËXYKMÌ6+v`v.6)öa6)v.v+ö)ö+ö)õªØ]ÛÙ]]Û\ÜÓ[YOHË]Ú]HÝ[Y^Ü\Ü\YÜ^KLMHÚYÝË\ÛHÜXÙK^KMÈÛ\ÜÓ[YOHÛXÛ^YÜ^KNL¶)öa6*¶`ö)öava6)ö*bÚÏÖÂÈ[YN	ÔÚÜYIËÝ]\ÎYK\ØÎ	ÜÛXÚXÝËLNK^\ÚÜYKÛÛIÈKÈ[YN	ÓÜ[RHÈÙ[Z[IËÝ]\ÎYK\ØÎ	ÐRHÙ\XÙ\È6ava¶-6-ÉÈKÈ[YN	ÔÝ\H^[Y[ÉËÝ]\Î[ÙK\ØÎ	ö.¶b¶f6,v,6av,v*6b6-È6*6.v+ö+ÉÈKÈ[YN	Ñ\X\ÙH\Ú	ËÝ]\ÎYK\ØÎ	Ð[ÚY	SÔÉÈKÈ[YN	ÐUÔÈÌÈÝÜYÙIËÝ]\Î[ÙK\ØÎ	öb¶kv*¶)ö+6b¶a¶.v+ö)ö+ÉÈKKX\
][HO
]Ù^O^Ú][K[Y_HÛ\ÜÓ[YOH^][\ËXÙ[\\ÝYKX]ÙY[LÈËYÜ^KMLÝ[Y[È]Û\ÜÓ[YOH^\ÛHÛ\Ù[ZXÛ^YÜ^KNÚ][K[Y_OÜÛ\ÜÓ[YOH^^È^YÜ^KMÚ][K\ØßOÜÙ]]Û\ÜÓ[YO^Ø^][\ËXÙ[\Ø\LKH^^ÈÛ\Ù[ZXÛ	Ú][KÝ]\ÈÈ	Ý^YÜY[M	È	Ý^YÜ^KM	ßXO]Û\ÜÓ[YO^ØËLLÝ[YY[	Ú][KÝ]\ÈÈ	ØËYÜY[ML	È	ØËYÜ^KLÌ	ßXHÏÚ][KÝ]\ÈÈ	öav*¶-va	È	ö.¶b¶f6,v,6av*¶-va	ßBÙ]Ù]
J_BÙ]Ù]Ù]
BBËÈ8¥ 8¥ 8¥UÓÓQÈ8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ ÛÛÝUÒUSTÎÈÙ^NÙXÝ[ÛÈX[Ý[ÎÈXÛÛ[NÈYÙOÎÝ[ÈV×HHÂÈÙ^N	Ù\ÚØ\	ËX[	öa6b6+v*H6)öa6*¶+v`öaIËXÛÛ^[Ý]\ÚØ\KÈÙ^N	ÛÜ\ÉËX[	ö)öa6-öa6*6)ö*ËXÛÛÚÜ[ÐØ\YÙN	ÌM
ÉÈKÈÙ^N	ÜÙXÝÉËX[	ö)öa6ava¶*¶+6)õªËXÛÛXÚØYÙHKÈÙ^N	ØÝ\ÝÛY\ÉËX[	ö)öa6.vava6)ö(IËXÛÛ\Ù\ÈKÈÙ^N	ØZIËX[	öav,v`ö,6)öa6,6`ö)ö(FbXÛÛÜ\Û\ÈKÈÙ^N	Ù\ÚYÛËX[	öav,v`ö,6)öavaö*¶-vavb¶aIËXÛÛ[]HKÈÙ^N	ÛX\Ù][ÉËX[	ö)öa6*¶,öb6b¶`v*ËXÛÛYYØ\ÛHKÈÙ^N	ÛX\Ù]XÙIËX[	ö)öa6,öb6`ÆbËXÛÛÝÜHKÈÙ^N	Ù[\ÞYY\ÉËX[	ö)öavaöböaöb¶a¶b6avbXÛÛ\Ù\ÛÙÈKÈÙ^N	Ù[[ÙIËX[	ö)öa6av)öa6b¶*VbÛX[XÛÛÛ\ÚYÛKÈÙ^N	Ü]ÜIËX[	öava¶-v*¶bbXÛÛ[Û]ÜKÈÙ^N	ÜÚÜYIËX[	ÔÚÜYIËXÛÛÚÜ[ÐYÈKÈÙ^N	ÜÙXÝ\]IËX[	ö)öa6(öav)öabÛX[XÛÛÚY[KÈÙ^N	ÜÙ][ÜÉËX[	ö)öa6)v.v+ö)ö+ö)õªËXÛÛÙ][ÜÈKBËÈ8¥ 8¥ 8¥ PRSÓÓTÓS8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ åxport default function AdminUI({ data }: { data: AdminData }) {
  const [section, setSection] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [search, setSearch] = useState('')

  const SECTION_MAP: Record<Section, React.ReactNode> = {
    dashboard:   <DashboardSection />,
    orders:      <OrdersSection />,
    products:    <ProductsSection />,
    customers:   <CustomersSection />,
    ai:          <AICenterSection />,
    design:      <DesignSection />,
    marketing:   <MarketingSection />,
    marketplace: <MarketplaceSection />,
    employees:   <EmployeesSection />,
    finance:     <FinanceSection />,
    platform:    <PlatformSection />,
    shopify:     <ShopifySection />,
    security:    <SecuritySection />,
    settings:    <SettingsSection />,
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="rtl">
      {/* ââ SIDEBAR âââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'} transition-all duration-200 bg-white border-l border-gray-200 flex flex-col shrink-0`}>
        {/* Logo */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">4LEEE</p>
            <p className="text-[10px] text-gray-400 font-medium">ADMIN PANEL</p>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all group ${
                section === item.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${section === item.key ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className={`mr-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  section === item.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">M</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">mohsen2020113</p>
              <p className="text-[10px] text-gray-400">Owner</p>
            </div>
            <LogOut className="w-3.5 h-3.5 text-gray-300 mr-auto" />
          </div>
        </div>
      </aside>

      {/* ââ MAIN ââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center gap-4 px-5 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ø¨Ø­Ø« Ø³Ø±ÙØ¹... Ctrl+K"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-9 pl-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 mr-auto">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute top-10 left-0 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900">Ø§ÙØ¥Ø´Ø¹Ø§Ø±Ø§Öª</h4>
                    <button onClick={() => setNotifOpen(false)}><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  {[
                    { text: 'Ø·ÙØ¨ Ø¬Ø¯ÙØ¯ #4522 ÙÙ ÙÙÙÙ Ø§ÙÙØ·ÙØ±Ù', time: 'ÙÙØ° 5 Ø¯ÙØ§ÙØ§Ù', icon: ShoppingCart, color: 'text-blue-500 bg-blue-50' },
                    { text: 'ÙÙØªØ¬ "Ø­ÙÙØ¨Ù© Titan" ÙÙØ¯ ÙÙ Ø§ÙÙÙØ²ÙÙ', time: 'ÙÙØ° 1 ÙØ³Ø§Ø¹Ù©', icon: AlertCircle, color: 'text-orange-500 bg-orange-50' },
                    { text: 'ÙØ²Ø§ÙÙØ© Shopify â 50 ÙÙØªØ¬', time: 'ÙÙØ± Ø³Ø§Ø¹Ù©', icon: CheckCircle2, color: 'text-green-500 bg-green-50' },
                  ].map((j, i) => (
                    <div key={i} className="p-3 hover:bg-gray-50 flex items-start gap-3 cursor-pointer">
                      <div className={`p-1.5 rounded-lg ${j.color.split(' ')[1]}`}>
                        <j.icon className={`w-3.5 h-3.5 ${j.color.split(' ')[0]}`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-medium leading-relaxed">{j.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{j.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">M</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {SECTION_MAP[section]}
        </main>
      </div>
    </div>
  )
}
