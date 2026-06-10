'use client'

import { ChevronLeft, Plus, MapPin, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AddressesPage() {
  const addresses = [
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street, Bangkok, Thailand 10110',
      phone: '+66 12 345 6789',
      default: true,
    },
    {
      id: 2,
      name: 'Office',
      address: '456 Business Ave, Bangkok, Thailand 10120',
      phone: '+66 87 654 3210',
      default: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
            <Plus className="w-5 h-5" /> Add New
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-pink-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">{addr.name}</h3>
                    {addr.default && <span className="text-xs text-pink-600 font-bold">Default Address</span>}
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{addr.address}</p>
              <p className="text-sm text-gray-600">{addr.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
