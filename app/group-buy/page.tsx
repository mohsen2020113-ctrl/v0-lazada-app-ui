'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Users, Clock, ShoppingCart, CheckCircle } from 'lucide-react'

const GROUPS = [
  { id: 1, name: 'آيفون 15 Pro 256GB', price: 3200, original: 4500, current: 12, target: 20, emoji: '📱', hours: 18 },
  { id: 2, name: 'سماعات سوني WH-1000XM5', price: 850, original: 1200, current: 8, target: 15, emoji: '🎧', hours: 6 },
  { id: 3, name: 'لابتوب Dell XPS 15', price: 4200, original: 5800, current: 19, target: 20, emoji: '💻', hours: 2 },
  { id: 4, name: 'ساعة Apple Watch Series 9', price: 1100, original: 1600, current: 5, target: 25, emoji: '⌚', hours: 36 },
]

function CountdownTimer({ hours }: { hours: number }) {
  const [time, setTime] = useState({ h: hours, m: 59, s: 59 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <span className="font-mono text-sm text-[#F57224]">
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </span>
  )
}

export default function GroupBuyPage() {
  const router = useRouter()
  const [joined, setJoined] = useState<number[]>([])

  const join = (id: number) => setJoined(prev => [...prev, id])

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white" dir="rtl">
      {/* Header */}
      <div className="bg-[#1A1A1A] px-4 py-4 flex items-center gap-3 border-b border-white/10">
        <button onClick={() => router.back()} className="text-white">
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-lg font-bold">الشراء الجماعي</h1>
        <span className="mr-auto text-xs text-gray-400">وفّر أكثر مع الآخرين</span>
      </div>

      {/* Banner */}
      <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-l from-[#F57224] to-[#e05a10] p-4 flex items-center gap-3">
        <Users className="w-8 h-8 text-white" />
        <div>
          <p className="font-bold text-white text-base">اشترِ مع الآخرين</p>
          <p className="text-white/80 text-xs">كلما زاد العدد، كلما انخفض السعر</p>
        </div>
      </div>

      {/* Group Deals */}
      <div className="p-4 space-y-4">
        {GROUPS.map(g => {
          const pct = Math.round((g.current / g.target) * 100)
          const done = joined.includes(g.id)
          const almostFull = pct >= 90

          return (
            <div key={g.id} className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
              {/* Product info */}
              <div className="flex gap-4 mb-3">
                <div className="w-16 h-16 bg-[#0F0F0F] rounded-xl flex items-center justify-center text-3xl">
                  {g.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm leading-tight mb-1">{g.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#F57224] font-bold text-lg">{g.price} د.إ</span>
                    <span className="text-gray-500 text-xs line-through">{g.original} د.إ</span>
                  </div>
                  <span className="text-green-400 text-xs">
                    وفّر {Math.round(((g.original - g.price) / g.original) * 100)}%
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {g.current} / {g.target} مشترك
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <CountdownTimer hours={g.hours} />
                  </span>
                </div>
                <div className="w-full bg-[#0F0F0F] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${almostFull ? 'bg-green-500' : 'bg-[#F57224]'}`}
                    style={{ widur: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              {done ? (
                <div className="flex items-center justify-center gap-2 py-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>انضممت للمجموعة!</span>
                </div>
              ) : (
                <button
                  onClick={() => join(g.id)}
                  className="w-full py-2.5 bg-[#F57224] rounded-xl flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  انضم الآن
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
