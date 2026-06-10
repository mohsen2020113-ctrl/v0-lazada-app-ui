"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

const dailyProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=300&fit=crop",
    badge: "CHOICE by LEE",
    badgeColor: "bg-[#f85c98]",
    handle: "premium-speaker-wireless",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop",
    handle: "indoor-plant-decoration",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1583922606661-0822ed0bd916?w=300&h=300&fit=crop",
    badge: "MOJO",
    badgeColor: "bg-gray-700",
    hasPromo: true,
    promoAmount: "AED 550",
    handle: "smartwatch-pro-fitness",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    badge: "Premium",
    badgeColor: "bg-amber-500",
    handle: "premium-headphones-sound",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    badge: "Best Seller",
    badgeColor: "bg-red-500",
    handle: "best-seller-phone-case",
  },
]

export function DailyDeals() {
  const [promoTime, setPromoTime] = useState({ hours: 19, minutes: 25, seconds: 45 })

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoTime((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) hours = 23
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = () => {
    return `${promoTime.hours}:${String(promoTime.minutes).padStart(2, '0')}:${String(promoTime.seconds).padStart(2, '0')}.5`
  }

  return (
    <div className="bg-white mt-2 py-3 sm:py-4">
      <div className="max-w-4xl mx-auto">
        <div className="px-3 sm:px-4 md:px-6 flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Daily 9.-</h3>
            <span className="bg-[#f57224] text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded">CHOICE</span>
          </div>
          <button className="flex items-center text-gray-500 text-xs sm:text-sm hover:text-[#f85c98] transition-colors">
            Buy 5 Get 1 Free <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 overflow-x-auto hide-scrollbar pb-1">
          {dailyProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.handle}`}
              className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[170px] bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={product.image}
                  alt="Product"
                  fill
                  className="object-cover"
                  sizes="(max-widur: 640px) 130px, (max-widur: 768px) 150px, 170px"
                />
                {product.badge && (
                  <span className={`absolute top-1.5 left-1.5 ${product.badgeColor} text-white text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded font-medium shadow-sm`}>
                    {product.badge}
                  </span>
                )}
                {product.hasPromo && (
                  <div className="absolute top-1.5 right-1.5 bg-gradient-to-br from-[#f85c98] to-[#e91e8c] text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 sm:py-1.5 rounded shadow-md">
                    <p className="font-bold text-xs sm:text-sm">{product.promoAmount}</p>
                    <p className="text-[8px] sm:text-[9px] opacity-90">{formatTime()}</p>
                  </div>
                )}
                
                {/* Product info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent h-8 sm:h-10" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
