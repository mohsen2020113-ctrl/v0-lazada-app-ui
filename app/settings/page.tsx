'use client'

import { useState } from 'react'
import { Bell, Tag, Truck, Globe, MapPin, DollarSign, Shield, FileText, Receipt, Info, Star, Share2, ChevronLeft } from 'lucide-react'

const STORE_URL = 'https://www.4leee.com'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#F57224]' : 'bg-white/20'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function ToggleRow({ icon: Icon, title, subtitle, checked, onChange }: any) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon size={20} className="text-[#F57224]" />
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{title}</p>
        <p className="text-white/30 text-xs">{subtitle}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

function LinkRow({ icon: Icon, title, trailing, href }: any) {
  return (
    <a
      href={href || '#'}
      target={href ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
    >
      <Icon size={20} className="text-[#F57224]" />
      <span className="flex-1 text-white text-sm font-medium">{title}</span>
      {trailing ? <span className="text-white/30 text-xs">{trailing}</span> : null}
      <ChevronLeft size={18} className="text-white/30" />
    </a>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="text-white/40 text-xs font-bold tracking-wider mb-2 px-4">{title}</p>
      <div className="mx-4 bg-[#1A1A1A] rounded-2xl overflow-hidden divide-y divide-white/5">
        {children}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [offers, setOffers] = useState(true)
  const [orders, setOrders] = useState(true)

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="px-4 py-4">
        <h1 className="text-white text-lg font-bold">الإعدادات</h1>
      </div>

      <Section title="الإشعارات">
        <ToggleRow icon={Bell} title="الإشعارات" subtitle="تفعيل جميع الإشعارات" checked={notifications} onChange={setNotifications} />
        <ToggleRow icon={Tag} title="العروض والخصومات" subtitle="إشعارات العروض الجديدة" checked={offers} onChange={setOffers} />
        <ToggleRow icon={Truck} title="تحديثات الطلبات" subtitle="تتبع حالة طلباتك" checked={orders} onChange={setOrders} />
      </Section>

      <Section title="اللغة والمنطقة">
        <LinkRow icon={Globe} title="اللغة" trailing="العربية" />
        <LinkRow icon={MapPin} title="المنطقة" trailing="الإمارات" />
        <LinkRow icon={DollarSign} title="العملة" trailing="AED" />
      </Section>

      <Section title="القانوني">
        <LinkRow icon={Shield} title="سياسة الخصوصية" href={`${STORE_URL}/policies/privacy-policy`} />
        <LinkRow icon={FileText} title="شروط الاستخدام" href={`${STORE_URL}/policies/terms-of-service`} />
        <LinkRow icon={Receipt} title="سياسة الإرجاع" href={`${STORE_URL}/pages/returns`} />
      </Section>

      <Section title="عن التطبيق">
        <LinkRow icon={Info} title="الإصدار" trailing="1.0.0" />
        <LinkRow icon={Star} title="قيّم التطبيق" />
        <LinkRow icon={Share2} title="شارك التطبيق" />
      </Section>

      <div className="text-center py-8">
        <p className="text-[#F57224] text-sm font-bold">LEE ماركت</p>
        <p className="text-white/30 text-xs mt-0.5">4leee.com</p>
      </div>
    </div>
  )
    }
