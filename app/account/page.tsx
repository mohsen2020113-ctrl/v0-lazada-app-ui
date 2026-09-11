'use client'

import Link from 'next/link'
import { ChevronRight, CreditCard, Gift, Heart, MessageCircle, Package, RotateCcw, Settings, Star, Truck, Wallet, Gamepad2 } from 'lucide-react'

const games = [
  { name: 'LazGames', detail: 'Win daily coins', icon: Gamepad2, color: 'bg-violet-100 text-violet-700' },
  { name: 'Daily Check-in', detail: 'Get free coins', icon: Gift, color: 'bg-amber-100 text-amber-700' },
  { name: 'Mission Center', detail: 'Complete missions', icon: Star, color: 'bg-rose-100 text-rose-700' },
]

const orderStatuses = [
  { label: 'To Pay', count: 2, icon: CreditCard },
  { label: 'To Ship', count: 0, icon: Package },
  { label: 'To Receive', count: 1, icon: Truck },
  { label: 'To Review', count: 0, icon: Star },
  { label: 'Returns', count: 0, icon: RotateCcw },
]

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-12 text-slate-900">
      <section className="bg-gradient-to-br from-[#c2185b] via-[#df286b] to-[#ff5b72] px-4 pb-16 pt-5 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/40 bg-amber-300 text-lg font-black text-amber-950">MA</div>
              <div><p className="text-sm text-white/75">Welcome back</p><h1 className="text-xl font-bold">Mohsen Alattas</h1></div>
            </div>
            <Link href="/account/settings" aria-label="Account settings" className="rounded-full bg-white/15 p-3 hover:bg-white/25"><Settings className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-6xl space-y-4 px-4">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">My vouchers</p><p className="mt-1 text-lg font-bold">52 vouchers available</p><p className="text-sm text-slate-500">Claim up to AED 1,000 in savings</p></div><Link href="/vouchers" className="rounded-full bg-[#c2185b] px-4 py-2 text-sm font-bold text-white">Claim</Link></div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold">My Games</h2><p className="text-sm text-slate-500">Play, collect coins, and unlock rewards</p></div><Link href="/missions" className="flex items-center gap-1 text-sm font-semibold text-[#c2185b]">Mission Center<ChevronRight className="h-4 w-4" /></Link></div><div className="grid gap-3 sm:grid-cols-3">{games.map(({ name, detail, icon: Icon, color }) => <button key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:border-[#c2185b]/30 hover:bg-rose-50"><span className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></span><span><span className="block text-sm font-bold">{name}</span><span className="text-xs text-slate-500">{detail}</span></span></button>)}</div><div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3"><div><p className="text-sm font-bold text-amber-950">250 free coins waiting</p><p className="text-xs text-amber-800">Check in today to collect</p></div><button className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white">Collect</button></div></section>

        <section className="rounded-2xl bg-white p-4 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">My Orders</h2><Link href="/account/orders" className="flex items-center gap-1 text-sm font-semibold text-[#c2185b]">View all<ChevronRight className="h-4 w-4" /></Link></div><div className="grid grid-cols-5 gap-2">{orderStatuses.map(({ label, count, icon: Icon }) => <Link href="/account/orders" key={label} className="group text-center"><span className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-[#c2185b] group-hover:bg-rose-100"><Icon className="h-5 w-5" />{count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c2185b] px-1 text-[10px] font-bold text-white">{count}</span>}</span><span className="mt-2 block text-[11px] font-semibold text-slate-600">{label}</span></Link>)}</div></section>

        <section className="rounded-2xl bg-white p-4 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold">My Channels</h2><p className="text-sm text-slate-500">Your personalized deals and content</p></div><button className="text-sm font-semibold text-[#c2185b]">Edit</button></div><div className="grid grid-cols-3 gap-3"><div className="rounded-xl bg-gradient-to-br from-fuchsia-100 to-rose-200 p-3"><p className="text-xs font-bold text-rose-800">PAYDAY</p><p className="mt-8 text-lg font-black text-rose-700">15% OFF</p></div><div className="rounded-xl bg-gradient-to-br from-sky-100 to-blue-200 p-3"><p className="text-xs font-bold text-blue-800">LazFlash</p><p className="mt-8 text-lg font-black text-blue-700">Deals now</p></div><div className="rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 p-3"><p className="text-xs font-bold text-orange-800">Rewards</p><p className="mt-8 text-lg font-black text-orange-700">Earn more</p></div></div></section>

        <section className="flex items-center justify-between rounded-2xl bg-slate-900 p-5 text-white shadow-sm"><div><p className="text-xs font-semibold uppercase tracking-wider text-rose-300">LazRewards</p><h2 className="mt-1 text-lg font-bold">Play more, earn more</h2><p className="mt-1 text-sm text-slate-300">Get AED 20 in rewards this week</p></div><Gift className="h-10 w-10 text-rose-300" /></section>

        <nav className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Link href="/account/profile" className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm hover:bg-rose-50"><Wallet className="h-5 w-5 text-[#c2185b]" /><span className="text-sm font-bold">Wallet</span></Link><Link href="/favorites" className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm hover:bg-rose-50"><Heart className="h-5 w-5 text-[#c2185b]" /><span className="text-sm font-bold">Wishlist</span></Link><Link href="/account/profile" className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm hover:bg-rose-50"><MessageCircle className="h-5 w-5 text-[#c2185b]" /><span className="text-sm font-bold">Messages</span></Link><Link href="/account/addresses" className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm hover:bg-rose-50"><Truck className="h-5 w-5 text-[#c2185b]" /><span className="text-sm font-bold">Addresses</span></Link></nav>
      </div>
    </main>
  )
}
