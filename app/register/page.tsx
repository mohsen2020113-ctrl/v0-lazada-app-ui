'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Phone, Lock, User, Mail, ArrowLeft } from 'lucide-react'

const STORE_URL = 'https://www.4leee.com'

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col" dir="rtl">
      <div className="flex items-center px-4 pt-12 pb-6">
        <Link href="/login" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center ml-3">
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <span className="text-white font-bold text-base">إنشاء حساب</span>
      </div>

      <div className="flex flex-col items-center py-6">
        <div className="w-16 h-16 rounded-3xl bg-[#F57224] flex items-center justify-center mb-3 shadow-lg shadow-orange-500/30">
          <span className="text-white font-black text-2xl">L</span>
        </div>
        <p className="text-white/40 text-sm">انضم إلى مجتمع LEE ماركت</p>
      </div>

      <div className="flex-1 px-6 pt-2">
        <div className="space-y-4">
          {[
            { label: 'الاسم الكامل', icon: User, value: name, set: setName, placeholder: 'أدخل اسمك', type: 'text' },
            { label: 'البريد الإلكتروني', icon: Mail, value: email, set: setEmail, placeholder: 'example@email.com', type: 'email' },
            { label: 'رقم الهاتف', icon: Phone, value: phone, set: setPhone, placeholder: '05xxxxxxxx', type: 'tel' },
          ].map(({ label, icon: Icon, value, set, placeholder, type }) => (
            <div key={label}>
              <label className="text-white/60 text-xs mb-1.5 block">{label}</label>
              <div className="flex items-center bg-[#1A1A1A] rounded-2xl px-4 h-14 gap-3">
                <Icon size={18} className="text-[#F57224] shrink-0" />
                <input type={type} value={value} onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-white placeholder-white/20 outline-none text-sm" />
              </div>
            </div>
          ))}
          <div>
            <label className="text-white/60 text-xs mb-1.5 block">كلمة المرور</label>
            <div className="flex items-center bg-[#1A1A1A] rounded-2xl px-4 h-14 gap-3">
              <Lock size={18} className="text-[#F57224] shrink-0" />
              <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-white placeholder-white/20 outline-none text-sm" />
              <button onClick={() => setShow(!show)}>
                {show ? <EyeOff size={18} className="text-white/30" /> : <Eye size={18} className="text-white/30" />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.open(`${STORE_URL}/account/register`, '_blank')}
          className="w-full mt-6 bg-[#F57224] text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-orange-500/30"
        >
          إنشاء الحساب
        </button>

        <p className="text-center mt-6 text-white/40 text-sm">
          لديك حساب؟{' '}
          <Link href="/login" className="text-[#F57224] font-bold">تسجيل الدخول</Link>
        </p>

        <p className="text-center mt-4 text-white/20 text-xs px-4">
          بالتسجيل توافق على <span className="text-white/40">شروط الاستخدام</span> و<span className="text-white/40">سياسة الخصوصية</span>
        </p>
      </div>
    </div>
  )
              }
