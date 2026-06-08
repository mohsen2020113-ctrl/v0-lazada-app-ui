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

  return (
    <div className="relative bg-white">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex aspect-square w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
      >
        {images.length > 0 ? (
          images.map((src, i) => (
            <div key={i} className="relative w-full flex-shrink-0 snap-center bg-gray-100">
              <img
                src={src || '/placeholder.svg'}
                alt={`${alt} - ${i + 1}`}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
              {/* Overlay product description */}
              {i === 0 && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-8">
                  <p className="text-sm font-semibold leading-relaxed text-white">
                    Premium quality mop bucket with advanced wringing system for easy floor cleaning
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Video / Photos toggle */}
      <div className="absolute right-3 top-3 flex overflow-hidden rounded-full bg-black/40 text-xs font-medium backdrop-blur">
        <button
          onClick={() => setTab('video')}
          className={`px-3 py-1 ${tab === 'video' ? 'rounded-full bg-white text-foreground' : 'text-white'}`}
        >
          Video
        </button>
        <button
          onClick={() => setTab('photos')}
          className={`px-3 py-1 ${tab === 'photos' ? 'rounded-full bg-white text-foreground' : 'text-white'}`}
        >
          Photos
        </button>
      </div>

      {/* Play button overlay when on video tab */}
      {tab === 'video' && (
        <button className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 backdrop-blur">
          <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
        </button>
      )}

      {/* Free shipping badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-sm bg-[#06A589] px-2 py-1.5 text-xs font-bold text-white shadow-md">
        <span className="bg-white/30 px-1 text-[8px] leading-none">FREE</span>
        <span>FREE SHIPPING</span>
      </div>

      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 rounded-md bg-[#FF3B30] px-2 py-1 text-xs font-bold text-white shadow-md">
          -{discount}%
        </div>
      )}

      {/* Page indicator */}
      <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
        {images.length > 0 ? `${current + 1}/${images.length}` : '0/0'}
      </div>
    </div>
  )
}
