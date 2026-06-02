'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Send, Paperclip, Image } from 'lucide-react'

const INITIAL_MESSAGES = [
  { id: 1, from: 'store', text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟', time: '10:00' },
  { id: 2, from: 'user', text: 'أريد الاستفسار عن المنتج رقم 123', time: '10:02' },
  { id: 3, from: 'store', text: 'بكل سرور! هذا المنتج متوفر وسيصلك خلال 3-5 أيام عمل.', time: '10:03' },
  { id: 4, from: 'user', text: 'هل يوجد ضمان على المنتج؟', time: '10:05' },
  { id: 5, from: 'store', text: 'نعم، يأتي مع ضمان سنة كاملة من الشركة المصنعة.', time: '10:06' },
]

export default function MessagePage() {
  const router = useRouter()
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      from: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }),
    }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        from: 'store',
        text: 'شكراً على رسالتك، سنرد عليك في أقرب وقت ممكن.',
        time: new Date().toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-[#1A1A1A] px-4 py-4 flex items-center gap-3 border-b border-white/10">
        <button onClick={() => router.back()} className="text-white">
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#F57224]/20 flex items-center justify-center text-lg">
          🏪
        </div>
        <div>
          <p className="font-semibold text-sm">متجر التقنية العصرية</p>
          <p className="text-xs text-green-400">متصل الآن</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
              msg.from === 'user'
                ? 'bg-[#F57224] text-white rounded-tr-sm'
                : 'bg-[#1A1A1A] text-white rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-[#1A1A1A] border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-2xl px-3 py-2">
          <button className="text-gray-500">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="text-gray-500">
            <Image className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="اكتب رسالتك..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
          <button
            onClick={send}
            className="w-8 h-8 bg-[#F57224] rounded-full flex items-center justify-center"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}
