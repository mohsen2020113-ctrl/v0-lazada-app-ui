"use client"

import { ShieldCheck, RotateCcw } from "lucide-react"

export function BenefitsBar() {
  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] via-[#232340] to-[#2d2d44] py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-center sm:gap-8 md:gap-12 text-white text-[10px] sm:text-xs md:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none justify-center">
          <span className="bg-[#00c853] text-white text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded font-bold tracking-wide">FREE</span>
          <span className="font-medium whitespace-nowrap">Free Shipping</span>
        </div>
        <div className="w-px h-3.5 sm:h-4 bg-white/30" />
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none justify-center">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00c853]" strokeWidth={2} />
          <span className="font-medium whitespace-nowrap">Fast Delivery</span>
        </div>
        <div className="w-px h-3.5 sm:h-4 bg-white/30" />
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none justify-center">
          <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4fc3f7]" strokeWidth={2} />
          <span className="font-medium whitespace-nowrap">Free Return</span>
        </div>
      </div>
    </div>
  )
}
