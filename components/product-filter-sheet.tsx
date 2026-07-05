'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export interface FilterState {
  subcategory: string | null
  priceMin: number
  priceMax: number
  brands: string[]
  shipping: string[]
}

interface ShippingOption {
  value: string
  label: string
}

interface ProductFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  subcategories: string[]
  brands: string[]
  shippingOptions: ShippingOption[]
  priceBounds: [number, number]
  value: FilterState
  onApply: (next: FilterState) => void
  computeCount: (state: FilterState) => number
}

export function ProductFilterSheet({
  isOpen,
  onClose,
  subcategories,
  brands,
  shippingOptions,
  priceBounds,
  value,
  onApply,
  computeCount,
}: ProductFilterSheetProps) {
  const [local, setLocal] = useState<FilterState>(value)

  useEffect(() => {
    if (isOpen) setLocal(value)
  }, [isOpen, value])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleBrand = (b: string) => {
    setLocal((prev) => ({
      ...prev,
      brands: prev.brands.includes(b) ? prev.brands.filter((x) => x !== b) : [...prev.brands, b],
    }))
  }

  const toggleShipping = (s: string) => {
    setLocal((prev) => ({
      ...prev,
      shipping: prev.shipping.includes(s) ? prev.shipping.filter((x) => x !== s) : [...prev.shipping, s],
    }))
  }

  const reset = () => {
    setLocal({ subcategory: null, priceMin: priceBounds[0], priceMax: priceBounds[1], brands: [], shipping: [] })
  }

  if (!isOpen) return null

  const liveCount = computeCount(local)

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] rounded-t-2xl max-h-[85vh] flex flex-col"
        dir="rtl"
      >
        <div className="w-full flex justify-center py-2 flex-shrink-0">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
          <h2 className="text-white font-bold text-lg">الفلاتر</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-6">
          {subcategories.length > 0 && (
            <div>
              <p className="text-white font-semibold text-sm mb-3">الفئة الفرعية</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setLocal((p) => ({ ...p, subcategory: null }))}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    local.subcategory === null
                      ? 'bg-[#C2185B] border-[#C2185B] text-white'
                      : 'border-white/20 text-white/70'
                  }`}
                >
                  الكل
                </button>
                {subcategories.map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setLocal((p) => ({ ...p, subcategory: sc }))}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      local.subcategory === sc
                        ? 'bg-[#C2185B] border-[#C2185B] text-white'
                        : 'border-white/20 text-white/70'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-white font-semibold text-sm mb-3">نطاق السعر (AED)</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={local.priceMin}
                min={priceBounds[0]}
                max={local.priceMax}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, priceMin: Math.min(Number(e.target.value) || 0, p.priceMax) }))
                }
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              />
              <span className="text-white/40">—</span>
              <input
                type="number"
                value={local.priceMax}
                min={local.priceMin}
                max={priceBounds[1]}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, priceMax: Math.max(Number(e.target.value) || 0, p.priceMin) }))
                }
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <input
              type="range"
              min={priceBounds[0]}
              max={priceBounds[1]}
              value={local.priceMax}
              onChange={(e) =>
                setLocal((p) => ({ ...p, priceMax: Math.max(Number(e.target.value), p.priceMin) }))
              }
              className="w-full mt-3 accent-[#C2185B]"
            />
            <div className="flex justify-between text-white/40 text-xs mt-1">
              <span>{priceBounds[0]} AED</span>
              <span>{priceBounds[1]} AED</span>
            </div>
          </div>

          {brands.length > 0 && (
            <div>
              <p className="text-white font-semibold text-sm mb-3">الماركة</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      local.brands.includes(b)
                        ? 'bg-[#C2185B] border-[#C2185B] text-white'
                        : 'border-white/20 text-white/70'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {shippingOptions.length > 0 && (
            <div>
              <p className="text-white font-semibold text-sm mb-3">خيارات الشحن</p>
              <div className="space-y-2">
                {shippingOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={local.shipping.includes(opt.value)}
                      onChange={() => toggleShipping(opt.value)}
                      className="w-4 h-4 accent-[#C2185B]"
                    />
                    <span className="text-white/80 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {subcategories.length === 0 && brands.length === 0 && shippingOptions.length === 0 && (
            <p className="text-white/40 text-sm text-center py-4">
              نطاق السعر فقط متاح حالياً لهذا التصنيف
            </p>
          )}
        </div>

        <div
          className="flex items-center gap-3 px-4 py-4 border-t border-white/10 flex-shrink-0"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <button onClick={reset} className="flex-1 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold">
            إعادة ضبط
          </button>
          <button
            onClick={() => {
              onApply(local)
              onClose()
            }}
            className="flex-1 py-3 rounded-xl bg-[#C2185B] text-white text-sm font-semibold"
          >
            عرض النتائج ({liveCount})
          </button>
        </div>
      </div>
    </>
  )
}
