'use client'

import { ChevronLeft, Plus, Edit2, Trash2, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', street: '123 Main St', city: 'Bangkok', postcode: '10100', default: true },
    { id: 2, label: 'Office', street: '456 Business Ave', city: 'Bangkok', postcode: '10200', default: false },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
            <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-bold">
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{addr.label}</h3>
                    {addr.default && <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold">Default</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 className="w-5 h-5 text-gray-600" /></button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5 text-red-600" /></button>
                </div>
              </div>
              <p className="text-gray-600">{addr.street}</p>
              <p className="text-gray-600">{addr.city}, {addr.postcode}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
