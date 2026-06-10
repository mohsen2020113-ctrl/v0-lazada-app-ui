'use client'

import { ChevronLeft, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Profile Picture */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Picture</h2>
            <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>
          <div className="w-32 h-32 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-6xl mb-4">👤</div>
          {isEditing && <input type="file" accept="image/*" className="px-4 py-2 border border-gray-300 rounded-lg" />}
        </div>

        {/* Personal Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">First Name</label>
              <input type="text" defaultValue="John" disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Last Name</label>
              <input type="text" defaultValue="Doe" disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input type="email" defaultValue="john@example.com" disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Phone</label>
              <input type="tel" defaultValue="+66 12 345 6789" disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 disabled:bg-gray-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">Bio</label>
              <textarea defaultValue="Premium member since 2022" disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 disabled:bg-gray-50" rows={3} />
            </div>
          </div>
          {isEditing && (
            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors" onClick={() => setIsEditing(false)}>Save Changes</button>
              <button className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
