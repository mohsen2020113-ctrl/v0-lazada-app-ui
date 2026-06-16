'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'

interface ZoomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  zoomLevel?: number
}

export function ZoomImage({ 
  src, 
  alt, 
  width = 300, 
  height = 300, 
  className = '',
  zoomLevel = 2.5
}: ZoomImageProps) {
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setZoomPosition({ x, y })
    setShowZoom(true)
  }

  const handleMouseLeave = () => {
    setShowZoom(false)
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 rounded-lg ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width, height }}
    >
      {/* Main Image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />

      {/* Zoom Lens - Circular magnifier */}
      {showZoom && (
        <div
          className="absolute pointer-events-none border-2 border-pink-500 rounded-full bg-white shadow-lg overflow-hidden"
          style={{
            width: 120,
            height: 120,
            left: zoomPosition.x - 60,
            top: zoomPosition.y - 60,
            boxShadow: '0 0 15px rgba(0,0,0,0.3)',
          }}
        >
          {/* Zoomed Image Inside Lens */}
          <div
            style={{
              position: 'absolute',
              width: width * zoomLevel,
              height: height * zoomLevel,
              backgroundImage: `url(${src})`,
              backgroundSize: `${width * zoomLevel}px ${height * zoomLevel}px`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${-(zoomPosition.x * zoomLevel - 60)}px ${-(zoomPosition.y * zoomLevel - 60)}px`,
              borderRadius: '50%',
              clipPath: 'circle(50%)',
            }}
          />
        </div>
      )}

      {/* Crosshair cursor indicator */}
      {showZoom && (
        <div
          className="absolute w-px h-8 bg-pink-500 pointer-events-none"
          style={{
            left: zoomPosition.x,
            top: zoomPosition.y - 16,
            opacity: 0.6,
          }}
        />
      )}
    </div>
  )
}
