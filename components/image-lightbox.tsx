'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

interface ImageLightboxProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const lastDistance = useRef<number | null>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const lastTranslate = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex)
      setScale(1)
      setTranslate({ x: 0, y: 0 })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, initialIndex])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goTo(index + 1)
      if (e.key === 'ArrowRight') goTo(index - 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index])

  const resetZoom = () => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }

  const goTo = (i: number) => {
    if (images.length === 0) return
    const next = (i + images.length) % images.length
    setIndex(next)
    resetZoom()
  }

  const getDistance = (touches: React.TouchList) => {
    const a = touches[0]
    const b = touches[1]
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches)
    } else if (e.touches.length === 1) {
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      lastTranslate.current = translate
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistance.current != null) {
      const dist = getDistance(e.touches)
      const delta = dist / lastDistance.current
      setScale((s) => Math.min(4, Math.max(1, s * delta)))
      lastDistance.current = dist
    } else if (e.touches.length === 1 && dragStart.current && scale > 1) {
      const dx = e.touches[0].clientX - dragStart.current.x
      const dy = e.touches[0].clientY - dragStart.current.y
      setTranslate({ x: lastTranslate.current.x + dx, y: lastTranslate.current.y + dy })
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) lastDistance.current = null
    if (e.touches.length === 0) {
      dragStart.current = null
      if (scale < 1.05) resetZoom()
    }
  }

  const handleDoubleClick = () => {
    if (scale > 1) resetZoom()
    else setScale(2.5)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setScale((s) => Math.min(4, Math.max(1, s - e.deltaY * 0.0015)))
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="إغلاق"
      >
        <X size={22} />
      </button>

      {images.length > 1 && (
        <span className="absolute top-4 right-4 z-10 text-white/70 text-sm">
          {index + 1} / {images.length}
        </span>
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="الصورة السابقة"
          >
            <ChevronRight size={22} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="الصورة التالية"
          >
            <ChevronLeft size={22} />
          </button>
        </>
      )}

      <div
        className="w-full h-full flex items-center justify-center overflow-hidden touch-none select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        {images[index] && (
          <img
            src={images[index]}
            alt=""
            draggable={false}
            className="max-w-full max-h-full object-contain transition-transform duration-150 cursor-zoom-in"
            style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}
          />
        )}
      </div>

      <div className="absolute bottom-5 flex items-center gap-3 z-10">
        <button
          onClick={() => setScale((s) => Math.max(1, s - 0.5))}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="تصغير"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={() => setScale((s) => Math.min(4, s + 0.5))}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="تكبير"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-5 right-5 z-10 flex gap-1.5 max-w-[40%] overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                goTo(i)
              }}
              className={`flex-shrink-0 w-10 h-10 rounded-md overflow-hidden border-2 transition-colors ${
                i === index ? 'border-[#C2185B]' : 'border-white/20'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
