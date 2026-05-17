import { ChevronLeft, Bell, Package, Tag, Zap, MessageCircle } from 'lucide-react';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

const NOTIFICATIONS = [
  { id: '1', icon: Zap, color: 'text-red-500 bg-red-50', title: 'Flash Sale Alert! ⚡', desc: 'Up to 60% off on selected items. Sale ends in 2 hours!', time: '5m ago', unread: true },
  { id: '2', icon: Package, color: 'text-blue-500 bg-blue-50', title: 'Order Shipped 📦', desc: 'Your order #1234 has been shipped and is on its way!', time: '2h ago', unread: true },
  { id: '3', icon: Tag, color: 'text-green-500 bg-green-50', title: 'New Voucher Available 🎟️', desc: 'You have a new 20% off voucher. Use it before it expires!', time: '1d ago', unread: false },
  { id: '4', icon: MessageCircle, color: 'text-purple-500 bg-purple-50', title: 'New message from LEE', desc: 'Your return request has been approved. Refund processing...', time: '2d ago', unread: false },
];

export default function NotificationsPage({ navigate }: Props) {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate('account')}><ChevronLeft size={22} /></button>
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
      </div>
      <div className="px-4 py-4 space-y-2">
        {NOTIFICATIONS.map(({ id, icon: Icon, color, title, desc, time, unread }) => (
          <div key={id} className={`card p-4 flex gap-3 ${unread ? 'border-l-4 border-orange-500' : ''}`}>
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-none`}><Icon size={20} /></div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${unread ? 'text-gray-900' : 'text-gray-700'}`}>{title}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{desc}</p>
              <p className="text-xs text-gray-400 mt-1">{time}</p>
            </div>
            {unread && <div className="w-2 h-2 bg-orange-500 rounded-full mt-1 flex-none" />}
          </div>
        ))}
      </div>
    </div>
  );
}
