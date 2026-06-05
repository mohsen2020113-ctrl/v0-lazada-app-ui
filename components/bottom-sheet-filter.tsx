'use client'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface FilterOption {
  label: string
  value: string
}

interface BottomSheetFilterProps {
  isOpen: boolean
  onClose: () => void
  options: FilterOption[]
  activeFilter: string
  onFilterChange: (value: string) => void
  title?: string
}

export function BottomSheetFilter({
  isOpen,
  onClose,
  options,
  activeFilter,
  onFilterChange,
  title = 'Sort By'
}: BottomSheetFilterProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleFilterSelect = (value: string) => {
    onFilterChange(value)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={handleBackdropClick}
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle Bar */}
        <div className="w-full flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="max-h-[60vh] overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterSelect(option.value)}
              className={`w-full px-4 py-4 text-left border-b border-gray-100 transition-colors flex items-center justify-between ${
                activeFilter === option.value
                  ? 'bg-pink-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className={`font-medium ${
                activeFilter === option.value
                  ? 'text-pink-600'
                  : 'text-gray-900'
              }`}>
                {option.label}
              </span>
              {activeFilter === option.value && (
                <div className="w-5 h-5 rounded-full border-2 border-pink-600 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-600" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Padding for safe area */}
        <div className="h-6" />
      </div>
    </>
  )
}
