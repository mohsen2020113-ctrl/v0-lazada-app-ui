'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  alt: string
  onImageChange?: (index: number) => void
}

export function ImageGallery({ images, alt, onImageChange }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const handlePrevImage = () => {
    const newIndex = Math.max(0, currentImage - 1)
    setCurrentImage(newIndex)
    onImageChange?.(newIndex)
    resetZoom()
  }

  const handleNextImage = () => {
    const newIndex = Math.min(images.length - 1, currentImage + 1)
    setCurrentImage(newIndex)
    onImageChange?.(newIndex)
    resetZoom()
  }

  const handleDotClick = (index: number) => {
    setCurrentImage(index)
    onImageChange?.(index)
    resetZoom()
  }

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    setIsDragging(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    setIsDragging(false)

    const dragEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    const diffX = dragStart.x - dragEnd.x
    const diffY = dragStart.y - dragEnd.y

    // If zoomed in, allow pan; otherwise allow swipe for gallery
    if (scale === 1) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) handleNextImage()
        else handlePrevImage()
      }
    }
  }

  // Pinch to zoom
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && imgRef.current) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const touchDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        )
        const newScale = Math.min(3, Math.max(1, scale + (distance > 100 ? 0.1 : -0.1)))
        setScale(newScale)
      }
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const newScale = Math.min(3, Math.max(1, scale - e.deltaY * 0.001))
    setScale(newScale)
  }

  if (!images.length) {
    return (
      <div className="w-full h-[360px] bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-white/20 text-sm">No images available</div>
      </div>
    )
  }

  return (
    <div className="relative bg-[#1A1A1A] overflow-hidden">
      {/* Main Gallery */}
      <div
        ref={containerRef}
        className="relative h-[360px] overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
      >
        <img
          ref={imgRef}
          src={images[currentImage]}
          alt={alt}
          className="w-full h-full object-contain transition-transform"
          style={{
            transform: `scale(${scale})`,
            cursor: scale > 1 ? 'grab' : 'grab',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png'
          }}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-20"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-20"
              aria-label="Next image"
            >
              <ChevronRight size={16} className="text-white" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        {scale > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <ZoomIn size={12} />
            {(scale * 100).toFixed(0)}%
          </div>
        )}
      </div>

      {/* Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentImage ? 'w-5 bg-[#F57224]' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
