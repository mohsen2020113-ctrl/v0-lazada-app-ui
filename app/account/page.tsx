'use client'

import Link from 'next/link'
import { User, Settings, Package, MapPin, CreditCard, RotateCcw, HelpCircle, MessageCircle, Shield, ChevronLeft, Star, Receipt } from 'lucide-react'

const STORE_URL = 'https://www.4leee.com'

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <div className="flex-1 bg-[#1A1A1A] rounded-xl py-4 flex flex-col items-center gap-1">
      <Icon size={22} className="text-[#F57224]" />
      <span className="text-white text-lg font-bold">{value}</span>
      <span className="text-white/40 text-xs">{label}</span>
    </div>
  )
}

function MenuItem({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
    >
      <Icon size={20} className="text-[#F57224]" />
      <span className="flex-1 text-white text-sm font-medium">{label}</span>
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

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-[#F57224] to-[#E04E0F] px-6 py-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3"
          style={{ background: 'rgba(255,255,255,0.2)' }}>
          <User size={44} className="text-white" />
        </div>
        <h2 className="text-white text-lg font-bold mb-1">مرحباً بك في LEE ماركت</h2>
        <p className="text-white/70 text-sm mb-5">سجّل دخولك لإدارة طلباتك</p>
        <div className="flex gap-3">
          <a
            href={`${STORE_URL}/account/login`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#F57224] font-bold px-7 py-2.5 rounded-full text-sm"
          >
            تسجيل الدخول
          </a>
          <a
            href={`${STORE_URL}/account/register`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white text-white px-5 py-2.5 rounded-full text-sm"
          >
            إنشاء حساب
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2.5 px-4 mt-5 mb-5">
        <StatCard value="0" label="طلب" icon={Receipt} />
        <StatCard value="0" label="مفضلة" icon={Star} />
        <StatCard value="0" label="مراجعة" icon={Star} />
      </div>

      {/* Menu */}
      <Section title="طلباتي">
        <MenuItem icon={Receipt} label="تاريخ الطلبات" href={`${STORE_URL}/account/orders`} />
        <MenuItem icon={Package} label="تتبع الطلبات" href={`${STORE_URL}/account`} />
        <MenuItem icon={RotateCcw} label="المرتجعات والاسترداد" href={`${STORE_URL}/pages/returns`} />
      </Section>

      <Section title="حسابي">
        <MenuItem icon={User} label="الملف الشخصي" href={`${STORE_URL}/account`} />
        <MenuItem icon={MapPin} label="عناويني" href={`${STORE_URL}/account/addresses`} />
        <MenuItem icon={CreditCard} label="طرق الدفع" href={`${STORE_URL}/account`} />
      </Section>

      <Section title="الدعم">
        <MenuItem icon={HelpCircle} label="الأسئلة الشائعة" href={`${STORE_URL}/pages/faq`} />
        <MenuItem icon={MessageCircle} label="تواصل معنا" href={`${STORE_URL}/pages/contact`} />
        <MenuItem icon={Shield} label="سياسة الخصوصية" href={`${STORE_URL}/policies/privacy-policy`} />
      </Section>

      <div className="text-center pb-8 mt-4">
        <p className="text-white/30 text-xs">LEE ماركت v1.0.0</p>
        <p className="text-[#F57224] text-xs font-semibold mt-0.5">4leee.com</p>
      </div>
    </div>
  )
      }
