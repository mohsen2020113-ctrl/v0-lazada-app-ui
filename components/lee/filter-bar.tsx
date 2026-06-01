'use client'

import { useState } from 'react'
import { SlidersHorizontal, ArrowUpDown, X, ChevronDown } from 'lucide-react'

type SortOption = 'default' | 'best-seller' | 'top-rated' | 'price-asc' | 'price-desc' | 'newest'

interface FilterBarProps {
  onSortChange?: (sort: SortOption) => void
  onFilterChange?: (filters: FilterState) => void
  productCount?: number
}

interface FilterState {
  priceMin: number
  priceMax: number
  minRating: number
  freeShipping: boolean
}

const CHIPS: { label: string; value: SortOption }[] = [
  { label: 'All', value: 'default' },
  { label: 'Best Seller', value: 'best-seller' },
  { label: 'Top Rated ⭐', value: 'top-rated' },
  { label: 'Price ↑', value: 'price-asc' },
  { label: 'Price ↓', value: 'price-desc' },
  { label: 'New', value: 'newest' },
]

export function FilterBar({ onSortChange, onFilterChange, productCount }: FilterBarProps) {
  const [activeSort, setActiveSort] = useState<SortOption>('default')
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceMin: 0, priceMax: 5000, minRating: 0, freeShipping: false
  })

  const handleChip = (value: SortOption) => {
    setActiveSort(value)
    onSortChange?.(value)
  }

  const applyFilters = () => {
    onFilterChange?.(filters)
    setShowFilterSheet(false)
  }

  return (
    <>
      {/* Filter bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Scrollable chips */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
            {CHIPS.map(chip => (
              <button
                key={chip.value}
                onClick={() => handleChip(chip.value)}
                className={'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ' +
                  (activeSort === chip.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300')}
              >
                {chip.label}
              </button>
            ))}
          </div>
          {/* Filter button */}
          <button
            onClick={() => setShowFilterSheet(true)}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-xs text-gray-600"
          >
            <SlidersHorizontal className="w-3 h-3" />
            Filter
          </button>
        </div>
        {productCount !== undefined && (
          <p className="px-3 pb-2 text-xs text-gray-400">{productCount} products found</p>
        )}
      </div>

      {/* Filter bottom sheet */}
      {showFilterSheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilterSheet(false)} />
          <div className="relative bg-white w-full rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Filter & Sort</h3>
              <button onClick={() => setShowFilterSheet(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Price range */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Price Range (AED)</p>
              <div className="flex items-center gap-3">
                <input type="number" value={filters.priceMin} min={0}
                  onChange={e => setFilters(f => ({...f, priceMin: Number(e.target.value)}))}
                  className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm" placeholder="Min" />
                <span className="text-gray-400">—</span>
                <input type="number" value={filters.priceMax} min={0}
                  onChange={e => setFilters(f => ({...f, priceMax: Number(e.target.value)}))}
                  className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm" placeholder="Max" />
              </div>
            </div>

            {/* Minimum rating */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</p>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map(r => (
                  <button key={r}
                    onClick={() => setFilters(f => ({...f, minRating: r}))}
                    className={'px-3 py-1.5 rounded-full text-xs border ' +
                      (filters.minRating === r ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600')}>
                    {r === 0 ? 'All' : r + '+ ⭐'}
                  </button>
                ))}
              </div>
            </div>

            {/* Free shipping */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-gray-700">Free Shipping Only</p>
              <button onClick={() => setFilters(f => ({...f, freeShipping: !f.freeShipping}))}
                className={'w-11 h-6 rounded-full transition-colors ' +
                  (filters.freeShipping ? 'bg-orange-500' : 'bg-gray-200')}>
                <div className={'w-5 h-5 bg-white rounded-full shadow transition-transform m-0.5 ' +
                  (filters.freeShipping ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>

            <button onClick={applyFilters}
              className="w-full py-3 bg-orange-500 text-white rounded-full font-semibold text-sm">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  )
}
