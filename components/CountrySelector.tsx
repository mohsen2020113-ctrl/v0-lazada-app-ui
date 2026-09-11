'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Globe, X, Check, ChevronRight, MapPin, Zap } from 'lucide-react'
import { useGeo } from '@/lib/hooks/useGeo'
import { COUNTRIES, CountryConfig } from '@/lib/warehouse-routing'

interface CountrySelectorProps {
  onCountryChange?: (country: string) => void
  showDeliveryInfo?: boolean
  compact?: boolean
}

export function CountrySelector({ 
  onCountryChange, 
  showDeliveryInfo = true,
  compact = false 
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig | null>(null)
  const geo = useGeo()

  useEffect(() => {
    setMounted(true)
    // Find currently selected country from geo
    const current = COUNTRIES.find(c => c.code === geo.country)
    if (current) setSelectedCountry(current)
  }, [geo.country])

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.nameAr.includes(searchQuery) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    // Sort with current country first
    if (a.code === selectedCountry?.code) return -1
    if (b.code === selectedCountry?.code) return 1
    return a.name.localeCompare(b.name)
  })

  const handleCountrySelect = (country: CountryConfig) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchQuery('')
    
    // Set geo cookie
    document.cookie = `4leee_country=${country.code}; path=/; max-age=${30 * 24 * 60 * 60}`
    
    if (onCountryChange) {
      onCountryChange(country.code)
    }
  }

  if (!mounted) return null

  const buttonLabel = selectedCountry 
    ? `${selectedCountry.code} - ${selectedCountry.name}`
    : 'Select Country'

  if (compact) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors text-sm font-medium text-teal-700"
        aria-label="Select country"
      >
        <MapPin className="w-4 h-4" />
        <span>{selectedCountry?.code || 'Country'}</span>
      </button>
    )
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 hover:bg-teal-200 transition-colors"
        title={buttonLabel}
        aria-label="Select country"
      >
        <Globe className="w-5 h-5 text-teal-700" />
      </button>

      {/* Modal Portal */}
      {createPortal(
        <>
          {/* Backdrop */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Bottom Sheet */}
          <div
            className={`fixed inset-x-0 bottom-0 z-[9999] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
              isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ maxHeight: '85vh' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between px-4 pb-3 border-b bg-white rounded-t-3xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Select Country</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filteredCountries.length} countries available
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-4 py-3 bg-gray-50 border-b sticky top-16">
              <input
                type="text"
                placeholder="Search country or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Countries List */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 160px)' }}>
              {filteredCountries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Globe className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-gray-500 text-center">
                    No countries found matching "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full flex items-start gap-4 px-4 py-3.5 text-left transition-colors hover:bg-teal-50 ${
                        selectedCountry?.code === country.code ? 'bg-teal-50' : ''
                      }`}
                    >
                      {/* Flag Emoji or Code */}
                      <div className="flex-shrink-0 text-2xl">
                        {country.code}
                      </div>

                      {/* Country Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {country.name}
                          </span>
                          {selectedCountry?.code === country.code && (
                            <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {country.nameAr}
                        </div>

                        {/* Delivery Info */}
                        {showDeliveryInfo && (
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Zap className="w-3.5 h-3.5 text-blue-500" />
                              <span>
                                {country.preferredWarehouse === 'dubai'
                                  ? `${country.deliveryDaysDubai} days`
                                  : `${country.deliveryDaysChina} days`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <span className="px-2 py-0.5 bg-gray-100 rounded">
                                {country.currency}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chevron */}
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500 sticky bottom-0">
              {selectedCountry && (
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">VAT Rate:</span> {(selectedCountry.vatRate * 100).toFixed(1)}%
                  </p>
                  <p>
                    <span className="font-semibold">Duty Rate:</span> {(selectedCountry.dutyRate * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}

export default CountrySelector
