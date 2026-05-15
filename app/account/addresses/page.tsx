'use client';

import { useState } from 'react';
import { Header } from '@/components/lee/header';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';

const mockAddresses = [
  {
    id: '1',
    name: 'Home',
    address: '123 Sukhumvit Road',
    city: 'Bangkok',
    postal: '10110',
    phone: '+66812345678',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Office',
    address: '456 Wireless Road',
    city: 'Bangkok',
    postal: '10330',
    phone: '+66812345678',
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header title="My Addresses" showBack />

      <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar">
        <div className="max-w-2xl mx-auto p-3">
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-lg p-3 sm:p-4 border-2 border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-[#f85c98] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-gray-900">{addr.name}</h3>
                      {addr.isDefault && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-1">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
                <p className="text-sm text-gray-600 mb-2">{addr.city} {addr.postal}</p>
                <p className="text-sm text-gray-500">{addr.phone}</p>
              </div>
            ))}
          </div>

          {/* Add New Address Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full mt-4 flex items-center justify-center gap-2 border-2 border-dashed border-[#f85c98] text-[#f85c98] py-4 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>

          {/* Add Address Form */}
          {showForm && (
            <div className="bg-white mt-4 p-4 rounded-lg border border-gray-200 space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f85c98]"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f85c98]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f85c98]"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f85c98]"
                />
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f85c98]"
              />
              <div className="flex gap-2">
                <button className="flex-1 bg-[#f85c98] text-white py-2.5 rounded-lg font-semibold hover:bg-[#ec407a] transition-colors">
                  Save Address
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-900 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
