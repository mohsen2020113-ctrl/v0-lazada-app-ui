'use client'

import { useState, useRef } from 'react'
import { Play } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  alt: string
  discount: number
}

export function ProductGallery({ images, alt, discount }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [tab, setTab] = useState<'video' | 'photos'>('photos')
  const trackRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!trackRef.current) return
    const { scrollLeft, clientWidth } = trackRef.current
    setCurrent(Math.round(scrollLeft / clientWidth))
  }

  const displayImages = images && images.length > 0 ? images : ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23f5f5f5" width="600" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23999"%3EProduct Image%3C/text%3E%3C/svg%3E']

  return (
    <div className="relative w-full bg-white">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        style={{ aspectRatio: '1', backgroundColor: '#f9f9f9' }}
      >
        {displayImages.map((src, i) => (
          <div key={i} className="relative w-full flex-shrink-0 snap-center">
            <img
              src={src}
              alt={`${alt} - ${i + 1}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23f5f5f5" width="600" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23999"%3EImage unavailable%3C/text%3E%3C/svg%3E'
              }}
            />
          </div>
        ))}
      </div>

      {/* Video/Photos Toggle */}
      <div className="absolute right-3 top-3 flex overflow-hidden rounded-full bg-black/40 backdrop-blur">
        <button
          onClick={() => setTab('video')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            tab === 'video' ? 'rounded-full bg-white text-foreground' : 'text-white'
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setTab('photos')}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            tab === 'photos' ? 'rounded-full bg-white text-foreground' : 'text-white'
          }`}
        >
          Photos
        </button>
      </div>

      {/* Play Button */}
      {tab === 'video' && (
        <button className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 backdrop-blur">
          <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
        </button>
      )}

      {/* Free Shipping Badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-sm bg-[#06A589] px-2 py-1.5 text-xs font-bold text-white shadow">
        <span className="bg-white/30 px-1 text-[7px] leading-none">FREE</span>
        <span>FREE SHIPPING</span>
      </div>

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 rounded-md bg-[#FF3B30] px-2 py-1 text-xs font-bold text-white shadow">
          -{discount}%
        </div>
      )}

      {/* Page Counter */}
      <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
        {current + 1}/{displayImages.length}
      </div>
    </div>
  )
}
