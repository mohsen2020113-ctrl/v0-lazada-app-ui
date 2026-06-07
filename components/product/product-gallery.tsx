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
        {images.map((src, i) => (
          <div key={i} className="relative w-full flex-shrink-0 snap-center">
            <img
              src={src || '/placeholder.svg'}
              alt={`${alt} - ${i + 1}`}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        ))}
      </div>

      {/* Video / Photos toggle */}
      <div className="absolute right-3 top-3 flex overflow-hidden rounded-full bg-black/35 text-sm font-medium backdrop-blur">
        <button
          onClick={() => setTab('video')}
          className={`px-4 py-1.5 ${tab === 'video' ? 'rounded-full bg-white text-foreground' : 'text-white'}`}
        >
          Video
        </button>
        <button
          onClick={() => setTab('photos')}
          className={`px-4 py-1.5 ${tab === 'photos' ? 'rounded-full bg-white text-foreground' : 'text-white'}`}
        >
          Photos
        </button>
      </div>

      {/* Play button overlay when on video tab */}
      {tab === 'video' && (
        <button className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 backdrop-blur">
          <Play className="ml-1 h-7 w-7 fill-white text-white" />
        </button>
      )}

      {/* Free shipping badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-[#06A589] px-3 py-1.5 text-xs font-bold text-white shadow">
        <span className="rounded-sm bg-white/25 px-1 text-[9px] leading-tight">FREE</span>
        FREE SHIPPING
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
        {current + 1}/{images.length}
      </div>
    </div>
  )
}
