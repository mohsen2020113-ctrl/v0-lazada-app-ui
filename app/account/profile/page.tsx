'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight, Camera, Edit2, MapPin, Phone, Mail } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const handleNavigateBack = useCallback(() => {
    router.push('/account')
  }, [router])

  const handleNavigate = useCallback((path: string) => {
    router.push(path)
  }, [router])

  const userProfile = {
    name: 'Mohsen Alattas',
    avatar: '👤',
    email: 'mohsen@example.com',
    phone: '+966 50 1234567',
    address: 'Riyadh, Saudi Arabia',
    joinDate: 'Joined January 2023',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center px-4 py-4 gap-3">
          <button 
            onClick={handleNavigateBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Profile Avatar Section */}
        <div className="bg-gradient-to-b from-pink-100 via-pink-50 to-white px-4 py-8">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-pink-300 bg-gradient-to-br from-pink-200 to-pink-100 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-6xl">{userProfile.avatar}</span>
              </div>
              <button className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-md transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center">{userProfile.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{userProfile.joinDate}</p>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="px-4 py-6 space-y-4">
          {/* Account Info Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5 text-pink-500" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-base font-medium text-gray-900 truncate">{userProfile.email}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-base font-medium text-gray-900">{userProfile.phone}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </div>

              {/* Address */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-base font-medium text-gray-900">{userProfile.address}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => handleNavigate('/account/settings')}
              className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-100 rounded-lg px-4 py-4 flex items-center gap-3 transition-colors"
            >
              <div className="w-5 h-5 text-pink-500">⚙️</div>
              <div className="flex-1 text-left">
                <p className="text-base font-medium text-gray-900">Account Settings</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>

            <button
              onClick={() => handleNavigate('/account/addresses')}
              className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-100 rounded-lg px-4 py-4 flex items-center gap-3 transition-colors"
            >
              <div className="w-5 h-5 text-pink-500">📍</div>
              <div className="flex-1 text-left">
                <p className="text-base font-medium text-gray-900">My Addresses</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>

            <button
              onClick={() => handleNavigate('/account/settings/payment')}
              className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-100 rounded-lg px-4 py-4 flex items-center gap-3 transition-colors"
            >
              <div className="w-5 h-5 text-pink-500">💳</div>
              <div className="flex-1 text-left">
                <p className="text-base font-medium text-gray-900">Payment Methods</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-pink-600">12</p>
              <p className="text-xs text-gray-600 mt-1">Orders</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">8</p>
              <p className="text-xs text-gray-600 mt-1">Reviews</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">125</p>
              <p className="text-xs text-gray-600 mt-1">Followers</p>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-12" />
      </main>
    </div>
  )
}
