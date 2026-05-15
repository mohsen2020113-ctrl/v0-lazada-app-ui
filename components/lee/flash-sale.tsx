"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

const flashProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop",
    price: "AED 161.00",
    discount: "-54%",
    brand: "XUANYUAN",
    name: "Monstera",
    badges: ["9x", "Gift", "Hot"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
    price: "AED 719.29",
    discount: "-44%",
    brand: "LINGDU",
    name: "1080P FHD",
    extraInfo: "10 YEAR",
    specs: ["WIFI", "G-SENSOR", "1080P"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    price: "AED 100.00",
    discount: "-61%",
    brand: "Minasan",
    name: "Storage Basket",
    hasCOD: true,
    has24h: true,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    price: "AED 299.00",
    discount: "-35%",
    brand: "TechPro",
    name: "Smart Watch",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    price: "AED 599.00",
    discount: "-40%",
    brand: "AudioMax",
    name: "Headphones",
  },
]

export function FlashSale() {
  const [time, setTime] = useState({ hours: 17, minutes: 24, seconds: 35 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              hours = 23
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatNumber = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="bg-white mt-2 py-3 sm:py-4">
      <div className="max-w-4xl mx-auto">
        <div className="px-3 sm:px-4 md:px-6 flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              LEEFla<span className="text-[#f57224]">&#9889;</span>h Sale
            </h3>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <span className="bg-[#1a1a2e] text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded min-w-[20px] sm:min-w-[24px] text-center">
                {formatNumber(time.hours)}
              </span>
              <span className="text-[#f85c98] font-bold text-xs sm:text-sm">:</span>
              <span className="bg-[#1a1a2e] text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded min-w-[20px] sm:min-w-[24px] text-center">
                {formatNumber(time.minutes)}
              </span>
              <span className="text-[#f85c98] font-bold text-xs sm:text-sm">:</span>
              <span className="bg-[#f85c98] text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded min-w-[20px] sm:min-w-[24px] text-center">
                {formatNumber(time.seconds)}
              </span>
            </div>
          </div>
          <button className="flex items-center text-gray-500 text-xs sm:text-sm font-medium hover:text-[#f85c98] transition-colors">
            MORE <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 overflow-x-auto hide-scrollbar pb-1">
          {flashProducts.map((product, index) => (
            <button
              key={product.id}
              className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[170px] bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow active:scale-[0.98] text-left"
            >
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 130px, (max-width: 768px) 150px, 170px"
                  priority={index < 2}
                />
                {/* Brand label */}
                <span className="absolute top-1.5 left-1.5 bg-white/95 text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded font-medium text-gray-700 shadow-sm">
                  {product.brand}
                </span>
                
                {/* Product name overlay */}
                {product.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-1.5 py-1">
                    <span className="text-white text-[9px] sm:text-[10px] font-medium">{product.name}</span>
                  </div>
                )}
                
                {/* Extra badges */}
                {product.badges && (
                  <div className="absolute bottom-1.5 left-1.5 flex gap-0.5">
                    {product.badges.map((badge, i) => (
                      <span key={i} className="bg-yellow-400 text-[7px] sm:text-[8px] px-1 rounded text-gray-800 font-bold">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* COD and 24h badges */}
                {(product.hasCOD || product.has24h) && (
                  <div className="absolute bottom-1.5 right-1.5 flex flex-col gap-0.5">
                    {product.has24h && (
                      <span className="bg-yellow-400 text-[6px] sm:text-[7px] px-1 py-0.5 rounded font-bold text-gray-800">
                        24h
                      </span>
                    )}
                    {product.hasCOD && (
                      <span className="bg-orange-500 text-white text-[6px] sm:text-[7px] px-1 py-0.5 rounded font-bold">
                        COD
                      </span>
                    )}
                  </div>
                )}
                
                {/* Specs row */}
                {product.specs && (
                  <div className="absolute bottom-8 left-0 right-0 px-1">
                    <div className="flex justify-center gap-0.5 sm:gap-1">
                      {product.specs.map((spec, i) => (
                        <span key={i} className="bg-gray-800/80 text-white text-[5px] sm:text-[6px] px-0.5 sm:px-1 py-0.5 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Extra info badge */}
                {product.extraInfo && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold">
                    {product.extraInfo}
                  </span>
                )}
              </div>
              <div className="p-2 sm:p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#f85c98] font-bold text-xs sm:text-sm">{product.price}</span>
                  <span className="bg-pink-100 text-[#f85c98] text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-semibold">
                    {product.discount}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
