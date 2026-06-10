'use client'
import { Bell, Package, Tag, Info } from 'lucide-react'

const NOTIFS = [
  { id: 1, type: 'order', title: 'تم تأكيد Orderك', body: 'Orderك #1003 قيد التجهيز الآن', time: 'منذ 5 دقائق', read: false },
  { id: 2, type: 'offer', title: 'عرض خاص لك!', body: 'خصم 20% على جميع Productات الأزياء اليوم', time: 'منذ ساعة', read: false },
  { id: 3, type: 'order', title: 'تم شحن Orderك', body: 'Orderك #1002 في الطريق إليك', time: 'أمس', read: true },
  { id: 4, type: 'info', title: 'Welcomeً بك في LEE ماركت', body: 'استكشف أحدث الProductات والعروض', time: 'منذ يومين', read: true },
]

const TYPE_ICONS: Record<string, { Icon: any; bg: string; color: string }> = {
  order: { Icon: Package, bg: 'bg-[#F57224]/15', color: 'text-[#F57224]' },
  offer: { Icon: Tag, bg: 'bg-green-500/15', color: 'text-green-400' },
  info: { Icon: Info, bg: 'bg-blue-500/15', color: 'text-blue-400' },
}

export default function NotificationsPage() {
  const unread = NOTIFS.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-[#0F0F0F]" dir="rtl">
      <div className="bg-[#0F0F0F] px-4 py-4 border-b border-white/5 flex items-center justify-between">
        <h1 className="text-white font-bold text-lg">الإشعارات</h1>
        {unread > 0 && (
          <span className="bg-[#F57224] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{unread}</span>
        )}
      </div>

      <div className="px-4 py-4 pb-24 space-y-2">
        {NOTIFS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Bell size={52} className="text-white/10" />
            <p className="text-white/40 text-sm">لا توجد إشعارات</p>
          </div>
        ) : (
          NOTIFS.map(notif => {
            const type = TYPE_ICONS[notif.type] || TYPE_ICONS.info
            const Icon = type.Icon
            return (
              <div key={notif.id} className={`flex gap-3 p-4 rounded-2xl ${notif.read ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A] border border-[#F57224]/20'}`}>
                <div className={`w-11 h-11 rounded-xl ${type.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={type.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${notif.read ? 'text-white/70' : 'text-white'}`}>{notif.title}</p>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-[#F57224] shrink-0 mt-1" />}
                  </div>
                  <p className="text-white/40 text-xs mt-0.5 line-clamp-2">{notif.body}</p>
                  <p className="text-white/25 text-xs mt-1.5">{notif.time}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
