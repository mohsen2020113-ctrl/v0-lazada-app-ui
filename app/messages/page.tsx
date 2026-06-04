'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, MoreVertical, MessageCircle, Package, Bell, Tag, Search, Heart, MessageSquare } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'product' | 'text'
  title?: string
  price?: string
  image?: string
  text?: string
  timestamp: string
}

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
}

export default function MessagesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('chats')
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'product',
      title: '(1ลิ้ง 30ห้อ) ...',
      price: '₹85.00',
      image: '📦',
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      type: 'product',
      title: 'แปรงขัดห้องน้ำ ...',
      price: '₹32.00',
      image: '🧹',
      timestamp: '2:25 PM',
    },
    {
      id: '3',
      type: 'product',
      title: 'ใหม่ไม้กวาดยาง...',
      price: '₹37.00',
      image: '🧼',
      timestamp: '2:20 PM',
    },
  ])

  const handleNavigate = useCallback((path: string) => {
    router.push(path)
  }, [router])

  const tabs: Tab[] = [
    {
      id: 'chats',
      label: 'Chats',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: 99,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <Package className="w-5 h-5" />,
      badge: 4,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: 'promos',
      label: 'Promos',
      icon: <Tag className="w-5 h-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-700 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-700 border-b border-gray-600">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Message+</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => handleNavigate('/trash')} className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-600">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 flex items-center gap-2 transition-colors relative border-b-2 ${
                activeTab === tab.id
                  ? 'text-gray-900 border-pink-500'
                  : 'text-gray-600 border-transparent hover:text-gray-700'
              }`}
            >
              {tab.id === 'chats' && <MessageSquare className="w-5 h-5" />}
              {tab.id === 'orders' && <Package className="w-5 h-5" />}
              {tab.id === 'alerts' && <Bell className="w-5 h-5" />}
              {tab.id === 'promos' && <Tag className="w-5 h-5" />}
              <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
              {tab.badge && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ml-1 ${
                  tab.id === 'chats' ? 'bg-red-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-4">
        {/* Chat Products Grid */}
        <div className="grid grid-cols-3 gap-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => msg.type === 'product' && handleNavigate('/product/detail')}
              className="rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-3xl rounded-t-lg group-hover:from-teal-600 group-hover:to-teal-800 transition-all">
                {msg.image}
              </div>
              <div className="bg-gray-600 p-2.5 rounded-b-lg">
                <p className="text-xs text-gray-900 font-medium truncate leading-tight">{msg.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-pink-500">{msg.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNavigate('/cart')
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white p-1.5 rounded transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message History Section */}
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">Message history above</p>
        </div>

        {/* Lazzie Bot Section */}
        <div className="bg-gray-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">🤖</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Lazzie</p>
              <p className="text-gray-700 text-sm mt-1">
                Saw ไม้กวาดหยายไซย์ยิฮะได้ 280 cm? —here&apos;s what else you might like...
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Checking on your order?</h2>
            </div>

            {/* Phone Illustration */}
            <div className="flex justify-center py-4">
              <div className="w-28 h-48 bg-gray-800 rounded-2xl border-4 border-gray-700 flex flex-col items-center justify-center p-3 relative">
                <div className="w-16 h-2 bg-gray-700 rounded-full mb-2" />
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-pink-500 rounded mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold">L</div>
                    <p className="text-white text-xs font-bold">Lazada</p>
                  </div>
                </div>
                <div className="h-1 w-12 bg-gray-600 rounded-full" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-900 font-semibold">Stay updated on order progress by turning on</p>
              <p className="text-gray-600 text-sm">Order Notifications</p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-3 text-center text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
              >
                Not now
              </button>
              <button
                onClick={() => {
                  setShowNotificationModal(false)
                  handleNavigate('/settings')
                }}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-colors"
              >
                Enable Order Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
