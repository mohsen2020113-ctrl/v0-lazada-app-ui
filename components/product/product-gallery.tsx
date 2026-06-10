'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronRight, Volume2, Copy } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  videos?: string[]
  productName: string
}

export function ProductGallery({ images, videos, productName }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'photos'>('video')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="bg-white">
      {/* Tab Switcher */}
      <div className="flex gap-2 px-4 pt-3 pb-2">
        <button
          onClick={() => setActiveTab('video')}
          className={`px-3 py-1 rounded text-sm font-medium ${
            activeTab === 'video'
              ? 'bg-white text-gray-900 border border-gray-300'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-3 py-1 rounded text-sm font-medium ${
            activeTab === 'photos'
              ? 'bg-white text-gray-900 border border-gray-300'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          Photos
        </button>
      </div>

      {/* Gallery Container */}
      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 aspect-square overflow-hidden">
        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[currentImageIndex]}
            alt={`${productName} ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* FREE SHIPPING Badge */}
          <div className="absolute bottom-4 left-4 bg-teal-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V7H3v2z" />
            </svg>
            FREE SHIPPING
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-70 text-white px-3 py-1 rounded text-xs font-medium">
            1/1
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Video Play Button */}
          {activeTab === 'video' && (
            <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition">
              <div className="w-16 h-16 rounded-full bg-gray-900 bg-opacity-70 flex items-center justify-center">
                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}

          {/* Sound and Share Icons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition">
              <Volume2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition">
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto pb-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`flex-shrink-0 w-14 h-14 rounded border-2 overflow-hidden transition ${
              idx === currentImageIndex ? 'border-pink-600' : 'border-gray-200'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
