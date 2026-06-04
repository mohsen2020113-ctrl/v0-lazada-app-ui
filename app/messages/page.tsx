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
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-800/95 backdrop-blur border-b border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Message+</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => handleNavigate('/trash')} className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-fit px-4 py-3 flex items-center justify-center gap-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-pink-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.badge && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  tab.id === 'chats' || tab.id === 'orders'
                    ? 'bg-red-600 text-white'
                    : ''
                }`}>
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
        {/* Chat Products Grid */}
        <div className="grid grid-cols-3 gap-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => msg.type === 'product' && handleNavigate('/product/detail')}
              className="bg-teal-700 rounded-lg p-2 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
            >
              <div className="w-full aspect-square bg-gray-700 rounded flex items-center justify-center text-3xl mb-1">
                {msg.image}
              </div>
              <p className="text-xs text-white font-medium truncate">{msg.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-pink-300">{msg.price}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigate('/cart')
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white p-1 rounded transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message History Section */}
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm">Message history above</p>
        </div>

        {/* Lazzie Bot Section */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-200 text-sm">Lazzie</p>
              <p className="text-gray-300 text-sm mt-1">
                Saw ไม้กวาดหยายไซย์ยิฮะได้ 280 cm? —here&apos;s what else you might like...
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Checking on your order?</h2>
            </div>

            {/* Phone Illustration */}
            <div className="flex justify-center py-4">
              <div className="w-32 h-56 bg-gray-800 rounded-3xl border-4 border-gray-600 flex flex-col items-center justify-center p-4 relative">
                <div className="w-20 h-4 bg-gray-600 rounded-full mb-2" />
                <div className="text-xs text-white text-center">
                  <p className="font-semibold">App notifications</p>
                  <p className="text-gray-400 mt-1">Lazada</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-700 font-semibold mb-1">Stay updated on order progress by turning on</p>
              <p className="text-gray-600 text-sm">Order Notifications</p>
            </div>

            <div className="space-y-3">
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
