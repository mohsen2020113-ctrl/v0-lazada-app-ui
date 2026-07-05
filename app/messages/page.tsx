'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, MoreVertical, MessageSquare, Package, Bell, Tag, Heart } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'product' | 'text'
  title?: string
  price?: string
  image?: string
  text?: string
}

export default function MessagesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('chats')
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setShowNotificationModal(true)
  }, [])
  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'product',
      title: '(1ลิ้ง 30ห้อ) ...',
      price: 'AED 85.00',
      image: '📦',
    },
    {
      id: '2',
      type: 'product',
      title: 'แปรงขัดห้องน้ำ ...',
      price: 'AED 32.00',
      image: '🧹',
    },
    {
      id: '3',
      type: 'product',
      title: 'ใหม่ไม้กวาดยาง...',
      price: 'AED 37.00',
      image: '🧼',
    },
  ])

  const handleNavigate = useCallback((path: string) => {
    router.push(path)
  }, [router])

  const tabs = [
    {
      id: 'chats',
      label: 'Chats',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: '99+',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <Package className="w-4 h-4" />,
      badge: '4',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: 'promos',
      label: 'Promos',
      icon: <Tag className="w-4 h-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Message+</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => handleNavigate('/trash')} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide border-t border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max px-4 py-3 flex items-center justify-center gap-2 transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-green-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
              {tab.badge && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-1 ${
                  tab.id === 'chats' || tab.id === 'orders'
                    ? 'bg-red-600 text-white'
                    : tab.id === 'alerts'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-red-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3 py-4">
        {/* Chat Products Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => msg.type === 'product' && handleNavigate(`/product/${msg.id}`)}
              className="bg-transparent group text-left transition-all cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="w-full aspect-square bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-lg flex items-center justify-center text-4xl font-bold group-hover:shadow-lg transition-all">
                {msg.image}
              </div>
              
              {/* Product Info */}
              <div className="mt-2">
                <p className="text-xs text-gray-400 font-medium truncate leading-tight h-8 flex items-center">
                  {msg.title}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold text-pink-500">{msg.price}</span>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNavigate('/cart')
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white p-1.5 rounded transition-all group-hover:scale-110 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message History Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-700" />
          <p className="text-xs text-gray-500 font-medium">Message history above</p>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* 4LEEE Bot Section */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 text-white text-lg font-bold">
              4
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-200 text-sm">4LEEE Assistant</p>
              <p className="text-gray-400 text-xs mt-1.5 leading-relaxed break-words">
                Saw ไม้กวาดหยายไซย์ยิฮะได้ 280 cm? —here&apos;s what else you might like...
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Notification Modal */}
      {isClient && showNotificationModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom">
            {/* Close area */}
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Heading */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Checking on your order?</h2>
            </div>

            {/* Phone Illustration */}
            <div className="flex justify-center py-4">
              <div className="relative w-32 h-56 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl border-8 border-gray-700 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-7 bg-gray-900 rounded-b-3xl z-10" />
                
                {/* Screen Content */}
                <div className="flex flex-col items-center justify-center flex-1 px-3">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">L</span>
                    </div>
                    <p className="text-white text-xs font-semibold">4LEEE</p>
                    <p className="text-gray-500 text-xs mt-1">App notifications</p>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 w-10 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Description */}
            <div className="text-center space-y-1">
              <p className="text-gray-900 font-semibold text-sm">Stay updated on order progress by turning on</p>
              <p className="text-gray-600 text-sm">Order Notifications</p>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-3 text-center text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors text-sm"
              >
                Not now
              </button>
              <button
                onClick={() => {
                  setShowNotificationModal(false)
                  handleNavigate('/account/settings')
                }}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-colors text-sm"
              >
                Enable Order Notifications
              </button>
            </div>

            {/* Bottom spacing */}
            <div className="h-4" />
          </div>
        </div>
      )}
    </div>
  )
}
