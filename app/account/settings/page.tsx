'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bell, ChevronDown, ChevronLeft, CreditCard, FileText, HelpCircle, LockKeyhole, LogOut, MessageSquare, Moon, ShieldCheck, UserRound } from 'lucide-react'

const sections = [
  { title: 'Account Information', detail: 'Profile, phone number, and email', icon: UserRound },
  { title: 'Payment Setting', detail: 'Manage cards and payment methods', icon: CreditCard },
  { title: 'Account Security', detail: 'Password and verification', icon: ShieldCheck },
  { title: 'Policies', detail: 'Terms, privacy, and legal information', icon: FileText },
  { title: 'Help', detail: 'FAQs and customer care', icon: HelpCircle },
  { title: 'Feedback', detail: 'Tell us how we can improve', icon: MessageSquare },
]

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  return (
    <main className={`${darkMode ? 'bg-slate-950 text-white' : 'bg-[#f7f7f8] text-slate-900'} min-h-screen pb-12`}>
      <header className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} sticky top-0 z-40 border-b px-4 py-4`}><div className="mx-auto flex max-w-3xl items-center gap-3"><Link href="/account" aria-label="Back to account" className="rounded-full p-2 hover:bg-slate-100"><ChevronLeft className="h-5 w-5" /></Link><h1 className="text-xl font-bold">Settings</h1></div></header>
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-6">
        <section className={`${darkMode ? 'bg-slate-900' : 'bg-white'} overflow-hidden rounded-2xl shadow-sm`}><div className="flex items-center justify-between border-b border-slate-100 p-4"><div className="flex items-center gap-3"><span className="rounded-xl bg-rose-50 p-3 text-[#c2185b]"><Bell className="h-5 w-5" /></span><div><p className="font-bold">Messages</p><p className="text-sm text-slate-500">Offers, order updates, and personal alerts</p></div></div><button aria-label="Toggle messages" className="h-6 w-11 rounded-full bg-[#c2185b] p-1"><span className="ml-5 block h-4 w-4 rounded-full bg-white" /></button></div><div className="grid grid-cols-2 divide-x divide-slate-100"><button className="p-4 text-left"><p className="text-xs text-slate-500">Country</p><p className="mt-1 font-semibold">United Arab Emirates</p></button><button className="p-4 text-left"><p className="text-xs text-slate-500">Language</p><p className="mt-1 font-semibold">English</p></button></div></section>
        <section className={`${darkMode ? 'bg-slate-900' : 'bg-white'} overflow-hidden rounded-2xl shadow-sm`}><Link href="/account/addresses" className="flex items-center justify-between border-b border-slate-100 p-4 hover:bg-rose-50"><div><p className="font-bold">Address Book</p><p className="text-sm text-slate-500">Manage your delivery addresses</p></div><ChevronDown className="h-5 w-5 -rotate-90 text-slate-400" /></Link><div className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><span className="rounded-xl bg-slate-100 p-3"><Moon className="h-5 w-5" /></span><div><p className="font-bold">Dark Mode</p><p className="text-sm text-slate-500">Use a darker appearance</p></div></div><button onClick={() => setDarkMode(!darkMode)} aria-pressed={darkMode} className={`h-6 w-11 rounded-full p-1 transition ${darkMode ? 'bg-[#c2185b]' : 'bg-slate-300'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${darkMode ? 'ml-5' : 'ml-0'}`} /></button></div></section>
        <section className={`${darkMode ? 'bg-slate-900' : 'bg-white'} overflow-hidden rounded-2xl shadow-sm`}>{sections.map(({ title, detail, icon: Icon }) => <div key={title} className="border-b border-slate-100 last:border-0"><button onClick={() => setOpen(open === title ? null : title)} className="flex w-full items-center justify-between p-4 text-left hover:bg-rose-50"><span className="flex items-center gap-3"><span className="rounded-xl bg-rose-50 p-3 text-[#c2185b]"><Icon className="h-5 w-5" /></span><span><span className="block font-bold">{title}</span><span className="text-sm text-slate-500">{detail}</span></span></span><ChevronDown className={`h-5 w-5 text-slate-400 transition ${open === title ? 'rotate-180' : ''}`} /></button>{open === title && <div className="bg-slate-50 px-16 pb-4 pt-1 text-sm text-slate-600">Choose an option to manage your {title.toLowerCase()}.</div>}</div>)}</section>
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 p-4 font-bold text-red-600 hover:bg-red-100"><LogOut className="h-5 w-5" />Log out</button>
        <div className="flex items-center justify-center gap-2 pt-4 text-xs text-slate-400"><LockKeyhole className="h-3 w-3" />Your account settings are private and secure</div>
      </div>
    </main>
  )
}
