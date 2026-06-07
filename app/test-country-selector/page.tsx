'use client'

import { useState } from 'react'
import { CountrySelector } from '@/components/CountrySelector'
import { useGeo } from '@/lib/hooks/useGeo'
import { formatPriceInCurrency } from '@/lib/geo'

export default function TestCountrySelectorPage() {
  const geo = useGeo()
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const testPrice = 299.99

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CountrySelector Component Test
          </h1>
          <p className="text-gray-600">
            Interactive demo showcasing the CountrySelector component with geo integration
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Component Display Modes</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Mode</h3>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 text-sm">Click the globe icon to open country selector:</p>
                <CountrySelector 
                  onCountryChange={setSelectedCountry}
                  showDeliveryInfo={true}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compact Mode</h3>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 text-sm">Compact button for headers and toolbars:</p>
                <CountrySelector 
                  onCountryChange={setSelectedCountry}
                  compact={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Geo Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm text-teal-700 font-semibold">Country</p>
              <p className="text-2xl font-bold text-teal-900">{geo.country}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-semibold">Currency</p>
              <p className="text-2xl font-bold text-blue-900">{geo.currency}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Currency Conversion</h2>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-600 text-sm mb-2">Base Price (AED):</p>
            <p className="text-4xl font-bold text-teal-600">AED {testPrice.toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { code: 'AED' }, { code: 'USD' }, { code: 'EUR' },
              { code: 'GBP' }, { code: 'SAR' }, { code: 'INR' },
            ].map(c => (
              <div key={c.code} className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">{c.code}</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPriceInCurrency(testPrice, c.code)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedCountry && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selected Country</h2>
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <p className="text-3xl font-bold text-green-900">{selectedCountry}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
