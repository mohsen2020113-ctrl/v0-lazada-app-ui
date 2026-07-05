'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Volume2, Share2, PlayCircle } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  videos?: string[]
  productName: string
}

export function ProductGallery({ images, videos, productName }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'photos'>('photos')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      {/* Tab Switcher */}
      {videos && videos.length > 0 && (
        <div className="flex gap-2 px-4 pt-3 pb-2 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'video'
                ? 'bg-white text-gray-900 border border-gray-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Video
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'photos'
                ? 'bg-white text-gray-900 border border-gray-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Photos
          </button>
        </div>
      )}

      {/* Gallery Container */}
      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 aspect-square overflow-hidden group">
        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center bg-white">
          <img
            src={images[currentImageIndex]}
            alt={`${productName} image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />

          {/* FREE SHIPPING Badge */}
          <div className="absolute bottom-4 left-4 bg-teal-500 text-white px-3 py-2 rounded font-bold text-sm flex items-center gap-1.5 shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.9 11.3L16.56 9.59C16.3 9.41 15.92 9.41 15.66 9.59L13.92 10.88C13.86 10.92 13.76 10.92 13.7 10.88L11.96 9.59C11.7 9.41 11.32 9.41 11.06 9.59L8.12 11.88C7.86 12.06 7.86 12.35 8.12 12.53L10.46 14.24C10.72 14.42 11.1 14.42 11.36 14.24L13.1 12.95C13.16 12.91 13.26 12.91 13.32 12.95L15.06 14.24C15.32 14.42 15.7 14.42 15.96 14.24L18.9 12.53C19.16 12.35 19.16 12.06 18.9 11.88V11.3Z" />
            </svg>
            FREE SHIPPING
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-70 text-white px-3 py-1 rounded text-xs font-medium">
            {currentImageIndex + 1}/{images.length}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2.5 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2.5 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Video Play Button */}
          {activeTab === 'video' && (
            <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition group/play">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center group-hover/play:bg-opacity-100 transition">
                <PlayCircle className="w-8 h-8 text-pink-600 fill-current" />
              </div>
            </button>
          )}

          {/* Top Right Icons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition">
              <Volume2 className="w-5 h-5 text-gray-700" />
            </button>
            <button className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 px-3 py-3 overflow-x-auto bg-gray-50 border-t border-gray-100">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all hover:border-pink-400 ${
                idx === currentImageIndex ? 'border-pink-600' : 'border-gray-300'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

