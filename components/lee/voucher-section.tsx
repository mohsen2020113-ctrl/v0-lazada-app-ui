"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"

const vouchers = [
  {
    id: 1,
    amount: "AED 1,000.00",
    label: "Payday",
    color: "text-[#f85c98]",
  },
  {
    id: 2,
    amount: "AED 30.00",
    label: "Free shipping",
    color: "text-[#00c853]",
  },
]

export function VoucherSection() {
  const [collected, setCollected] = useState<number[]>([])
  const [isCollecting, setIsCollecting] = useState(false)

  const handleCollectAll = () => {
    setIsCollecting(true)
    setTimeout(() => {
      setCollected(vouchers.map(v => v.id))
      setIsCollecting(false)
    }, 500)
  }

  const handleCollectSingle = (id: number) => {
    if (!collected.includes(id)) {
      setCollected([...collected, id])
    }
  }

  return (
    <div className="bg-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Biggest Saving</h3>
          <button className="flex items-center text-gray-500 text-xs sm:text-sm hover:text-[#f85c98] transition-colors">
            More vouchers <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {vouchers.map((voucher) => (
            <button
              key={voucher.id}
              onClick={() => handleCollectSingle(voucher.id)}
              disabled={collected.includes(voucher.id)}
              className="flex-1 relative group"
            >
              <div className={`border border-dashed rounded-lg p-2 sm:p-2.5 md:p-3 transition-all ${
                collected.includes(voucher.id) 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-gray-300 bg-white hover:border-[#f85c98]/50 hover:bg-pink-50/30'
              }`}>
                <p className={`font-bold text-sm sm:text-base md:text-lg ${collected.includes(voucher.id) ? 'text-gray-400' : voucher.color}`}>
                  {voucher.amount}
                </p>
                <p className={`text-[10px] sm:text-xs ${collected.includes(voucher.id) ? 'text-gray-400' : voucher.color}`}>
                  {voucher.label}
                </p>
                {collected.includes(voucher.id) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-[#00c853] text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-bold">
                      Collected
                    </span>
                  </div>
                )}
              </div>
              {/* Decorative ticket circles */}
              <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-100 rounded-full -translate-y-1/2" />
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-gray-100 rounded-full -translate-y-1/2" />
            </button>
          ))}
          <button 
            onClick={handleCollectAll}
            disabled={collected.length === vouchers.length || isCollecting}
            className={`text-white font-semibold px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
              collected.length === vouchers.length 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#f57224] hover:bg-[#e56318]'
            }`}
          >
            {isCollecting ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </span>
            ) : collected.length === vouchers.length ? (
              "Collected"
            ) : (
              "Collect All"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
