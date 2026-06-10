'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Phone, Lock, ArrowLeft } from 'lucide-react'

const STORE_URL = 'https://www.4leee.com'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-6">
        <Link href="/" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center ml-3">
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <span className="text-white font-bold text-base">تسجيل الدخول</span>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 rounded-3xl bg-[#F57224] flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
          <span className="text-white font-black text-3xl">L</span>
        </div>
        <h1 className="text-white text-2xl font-black mb-1">LEE ماركت</h1>
        <p className="text-white/40 text-sm">أفضل التسوق بأفضل الأسعار</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-4">
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">رقم الهاتف</label>
            <div className="flex items-center bg-[#1A1A1A] rounded-2xl px-4 h-14 gap-3">
              <Phone size={18} className="text-[#F57224] shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="flex-1 bg-transparent text-white placeholder-white/20 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">كلمة المرور</label>
            <div className="flex items-center bg-[#1A1A1A] rounded-2xl px-4 h-14 gap-3">
              <Lock size={18} className="text-[#F57224] shrink-0" />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-white placeholder-white/20 outline-none text-sm"
              />
              <button onClick={() => setShow(!show)}>
                {show ? <EyeOff size={18} className="text-white/30" /> : <Eye size={18} className="text-white/30" />}
              </button>
            </div>
          </div>
          <div className="text-left">
            <a href={`${STORE_URL}/account/login`} target="_blank" rel="noopener noreferrer"
              className="text-[#F57224] text-xs">نسيت كلمة المرور؟</a>
          </div>
        </div>

        <button
          onClick={() => window.open(`${STORE_URL}/account/login`, '_blank')}
          className="w-full mt-6 bg-[#F57224] text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-orange-500/30"
        >
          تسجيل الدخول
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">أو</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-[#1A1A1A] py-3.5 rounded-2xl">
            <span className="text-lg">🍎</span>
            <span className="text-white text-sm font-semibold">Apple</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#1A1A1A] py-3.5 rounded-2xl">
            <span className="text-lg">🔵</span>
            <span className="text-white text-sm font-semibold">Google</span>
          </button>
        </div>

        <p className="text-center mt-8 text-white/40 text-sm">
          ليس لديك حساب؟ تواصل معنا للمزيد من المعلومات
        </p>
      </div>
    </div>
  )
        }
